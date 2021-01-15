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
import faker from "faker";
import { setupServer } from "msw/node";

import NewTaskModal from "../../../admin/tasks/NewTaskModal";

import { handlers as taskHandlers } from "../../../__mocks__/admin/task";
import { handlers as userHandlers } from "../../../../api/__mocks__/user";
import { data as taskData } from "../../../../fixtures/task";
import selectEvent from "react-select-event";
import { data as userData } from "../../../../fixtures/user";

const renderNewTaskModal = () => {
  const onHide = jest.fn();
  const props = {
    projectId: 1,
    onHide,
  };
  const task = taskData.entries[0];
  render(<NewTaskModal {...props} />);
  return {
    onHide,
    task,
  };
};

const setupModalForm = () => {
  const summaryInput = screen.getByLabelText(/summary/i) as HTMLInputElement;
  const descriptionInput = screen.getByLabelText(
    /description/i
  ) as HTMLInputElement;
  const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement;
  const assigneeSelect = screen.getByLabelText(/assignee/i) as HTMLInputElement;
  const changeSummaryInput = (value: string) =>
    fireEvent.change(summaryInput, { target: { value: value } });
  const changeDescriptionInput = (value: string) =>
    fireEvent.change(descriptionInput, { target: { value: value } });
  const changeStatusSelect = (value: string) =>
    fireEvent.change(statusSelect, { target: { value: value } });
  const changeAssigneeSelect = async (value: string) => {
    fireEvent.change(assigneeSelect, {
      target: { value: value },
    });
    await selectEvent.select(assigneeSelect, value);
  };
  const submitButton = screen.getByRole("button", {
    name: /save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    summaryInput,
    descriptionInput,
    statusSelect,
    assigneeSelect,
    changeSummaryInput,
    changeDescriptionInput,
    changeStatusSelect,
    changeAssigneeSelect,
    clickSubmit,
  };
};

describe("NewTaskModal", () => {
  const server = setupServer(...taskHandlers, ...userHandlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render new task modal", async () => {
    renderNewTaskModal();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/new task/i)).toBeInTheDocument();
  });

  it("should submit the form if valid", async () => {
    const { task, onHide } = renderNewTaskModal();

    const {
      changeSummaryInput,
      changeDescriptionInput,
      changeStatusSelect,
      changeAssigneeSelect,
      clickSubmit,
    } = setupModalForm();
    changeSummaryInput(task.summary);
    changeDescriptionInput(task.description);
    changeStatusSelect(task.status);
    await changeAssigneeSelect(userData.entries[0].full_name);
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });

  it("should show error messages if form is invalid", async () => {
    const { task } = renderNewTaskModal();
    const {
      changeSummaryInput,
      changeDescriptionInput,
      changeStatusSelect,
      clickSubmit,
    } = setupModalForm();

    changeSummaryInput("__test_error_input__");
    changeDescriptionInput(task.description);
    changeStatusSelect(task.status);
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/__test_error_description__/)
    ).toBeInTheDocument();
  });
});
