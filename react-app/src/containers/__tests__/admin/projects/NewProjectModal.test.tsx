import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";
import selectEvent from "react-select-event";

import NewProjectModal from "../../../admin/projects/NewProjectModal";

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
    isAdmin: true,
    onHide,
  };
  const url = `/admin/projects`;
  const project = projectData.entries[0];

  const utils = render(
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
    utils,
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
    const { project, onHide } = renderNewProjectModal();
    expect(screen.getByText(/New Project/i)).toBeInTheDocument();

    const { changeNameInput, clickSubmit } = await setupModalForm();

    changeNameInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/Name is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Client is required/)).toBeInTheDocument();

    await changeNameInput(project.name);
    fireEvent.change(screen.getByLabelText(/Client/i), {
      target: { value: userData.entries[0].first_name },
    });
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
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
    fireEvent.change(screen.getByLabelText(/Client/i), {
      target: { value: userData.entries[0].first_name },
    });
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    await selectEvent.select(
      screen.getByLabelText(/Client/i),
      userData.entries[0].full_name as string
    );

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
