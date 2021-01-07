import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import faker from "faker";
import userEvent from "@testing-library/user-event";
import { SWRConfig, cache } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";

import NewProjectModal from "../../../client/projects/NewProjectModal";

import {
  handlers as projectHandler,
  data as projectData,
} from "../../../__mocks__/client/project";
import {
  handlers as userHandler,
  data as userData,
} from "../../../__mocks__/user";

const renderNewProjectModal = () => {
  const onHide = jest.fn();

  const props = {
    id: 1,
    onHide,
  };
  const url = `/projects`;
  const project = {
    name: `${faker.random.number()} ${faker.lorem.word()}`,
  };

  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <NewProjectModal {...props} />
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

describe("NewProjectModal", () => {
  const server = setupServer(...projectHandler, ...userHandler);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should show new project modal and user info", async () => {
    const { url, project, onHide } = renderNewProjectModal();
    expect(screen.getByText(/New Project/i)).toBeInTheDocument();

    const { changeNameInput, clickSubmit } = await setupModalForm();

    changeNameInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/Name is required/)).toBeInTheDocument();

    await changeNameInput(project.name);
    act(() => {
      clickSubmit();
    });

    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });

  it("should show new project modal and error message", async () => {
    const { url, project, onHide } = renderNewProjectModal();

    const { changeNameInput, clickSubmit } = await setupModalForm();

    server.use(
      rest.post(url, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({ name: "Project already exists" })
        );
      })
    );

    await changeNameInput(project.name);
    act(() => {
      clickSubmit();
    });

    expect(
      await screen.findByText(/Project already exists/)
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(onHide).not.toHaveBeenCalledWith();
    });
  });
});
