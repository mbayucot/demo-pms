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
import selectEvent from "react-select-event";
import { SWRConfig } from "swr";
import { setupServer } from "msw/node";

import NewProjectModal from "../../../admin/projects/NewProjectModal";

import { handlers as projectHandlers } from "../../../__mocks__/admin/project";
import { handlers as userHandlers } from "../../../../api/__mocks__/user";
import { data as projectData } from "../../../../fixtures/project";
import { data as userData } from "../../../../fixtures/user";

const renderNewProjectModal = () => {
  const onHide = jest.fn();
  const props = {
    isAdmin: true,
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
  const clientSelect = screen.getByLabelText(/client/i) as HTMLInputElement;
  const changeNameInput = (value: string) =>
    fireEvent.change(nameInput, { target: { value: value } });
  const changeClientSelect = async (value: string) => {
    fireEvent.change(clientSelect, {
      target: { value: value },
    });
    await selectEvent.select(clientSelect, value);
  };
  const submitButton = screen.getByRole("button", {
    name: /save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    nameInput,
    clientSelect,
    changeNameInput,
    changeClientSelect,
    clickSubmit,
  };
};

describe("NewProjectModal", () => {
  const server = setupServer(...projectHandlers, ...userHandlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render new project modal", async () => {
    renderNewProjectModal();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/new project/i)).toBeInTheDocument();
  });

  it("should submit the form if valid", async () => {
    const { project, onHide } = renderNewProjectModal();
    const {
      changeNameInput,
      changeClientSelect,
      clickSubmit,
    } = setupModalForm();

    changeNameInput(project.name);
    await changeClientSelect(userData.entries[0].full_name);
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });

  it("should show error messages if form is invalid", async () => {
    renderNewProjectModal();
    const {
      changeClientSelect,
      changeNameInput,
      clickSubmit,
    } = setupModalForm();
    changeNameInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

    await changeNameInput("__test_error_input__");
    await changeClientSelect(userData.entries[0].full_name);
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/__test_error_description__/)
    ).toBeInTheDocument();
  });
});
