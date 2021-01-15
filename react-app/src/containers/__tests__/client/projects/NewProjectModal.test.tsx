import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import { setupServer } from "msw/node";

import NewProjectModal from "../../../client/projects/NewProjectModal";

import { handlers as projectHandlers } from "../../../__mocks__/client/project";
import { data as projectData } from "../../../../fixtures/project";

const renderNewProjectModal = () => {
  const onHide = jest.fn();
  const props = {
    id: 1,
    onHide,
  };
  const project = projectData.entries[0];
  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <NewProjectModal {...props} />
    </SWRConfig>
  );
  return {
    onHide,
    project,
  };
};

const setupModalForm = () => {
  const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
  const changeNameInput = (value: string) =>
    fireEvent.change(nameInput, { target: { value: value } });
  const submitButton = screen.getByRole("button", {
    name: /save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    nameInput,
    changeNameInput,
    clickSubmit,
  };
};

describe("NewProjectModal", () => {
  const server = setupServer(...projectHandlers);

  beforeAll(() => server.listen());

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
  });

  it("should render new project modal", async () => {
    renderNewProjectModal();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/new project/i)).toBeInTheDocument();
  });

  it("should submit the form if valid", async () => {
    const { project, onHide } = renderNewProjectModal();
    const { changeNameInput, clickSubmit } = setupModalForm();

    await changeNameInput(project.name);
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });

  it("should show error messages if form is invalid", async () => {
    renderNewProjectModal();
    const { changeNameInput, clickSubmit } = setupModalForm();
    changeNameInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

    await changeNameInput("__test_error_input__");
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/__test_error_description__/)
    ).toBeInTheDocument();
  });
});
