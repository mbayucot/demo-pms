import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import faker from "faker";
import { SWRConfig, cache } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";

import EditProjectModal from "../../../admin/projects/EditProjectModal";

import {
  handlers as projectHandler,
  data as projectData,
} from "../../../__mocks__/client/project";
import {
  handlers as userHandler,
  data as userData,
} from "../../../__mocks__/user";

const renderEditProjectModal = () => {
  const onHide = jest.fn();

  const props = {
    id: 1,
    isAdmin: true,
    onHide,
  };
  const url = `/admin/projects/${props.id}`;
  const project = projectData.entries[0];

  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <EditProjectModal {...props} />
    </SWRConfig>
  );
  const error = { name: "__error__" };
  return {
    onHide,
    url,
    project,
    error,
  };
};

const setupModalForm = async () => {
  const nameInput = (await screen.findByLabelText(/name/i)) as HTMLInputElement;
  const changeNameInput = (value: string) =>
    fireEvent.change(nameInput, { target: { value: value } });
  const submitButton = screen.getByRole("button", {
    name: /Save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    nameInput,
    changeNameInput,
    clickSubmit,
  };
};

describe("EditProjectModal", () => {
  const server = setupServer(...projectHandler, ...userHandler);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should show edit user modal and user info", async () => {
    const { url, project, onHide } = renderEditProjectModal();
    expect(screen.getByText(/Edit Project/i)).toBeInTheDocument();
    expect(screen.getByRole(/status/i)).toHaveTextContent(/loading/i);

    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { nameInput, changeNameInput, clickSubmit } = await setupModalForm();

    expect(nameInput.value).toBe(project.name);

    changeNameInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/Name is required/)).toBeDefined();

    changeNameInput(`${faker.random.number()} ${faker.lorem.word()}`);
    fireEvent.change(screen.getByLabelText(/Client/i), {
      target: { value: userData.entries[0].first_name },
    });
    await selectEvent.select(
      screen.getByLabelText(/Client/i),
      userData.entries[0].full_name as string
    );

    server.use(
      rest.patch(url, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({ name: "Name already exists" })
        );
      })
    );

    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/Name already exists/)).toBeDefined();

    changeNameInput(project.name);
    fireEvent.change(screen.getByLabelText(/Client/i), {
      target: { value: userData.entries[0].first_name },
    });
    await selectEvent.select(
      screen.getByLabelText(/Client/i),
      userData.entries[0].full_name as string
    );

    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });
});
