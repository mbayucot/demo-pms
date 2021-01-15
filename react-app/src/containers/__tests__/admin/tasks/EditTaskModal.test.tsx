import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig, cache } from "swr";
import { setupServer } from "msw/node";

import EditTaskModal from "../../../admin/tasks/EditTaskModal";

import { handlers as taskHandlers } from "../../../__mocks__/admin/task";
import { handlers as userHandlers } from "../../../../api/__mocks__/user";
import { data as taskData } from "../../../../fixtures/task";
import selectEvent from "react-select-event";
import { data as userData } from "../../../../fixtures/user";

const renderEditTaskModal = () => {
  const onHide = jest.fn();
  const props = {
    id: 1,
    onHide,
  };
  const task = taskData.entries[0];
  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <EditTaskModal {...props} />
    </SWRConfig>
  );
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

describe("EditTaskModal", () => {
  const server = setupServer(...taskHandlers, ...userHandlers);

  beforeAll(() => server.listen());

  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
  });

  it("should render edit task modal and show info", async () => {
    const { task } = renderEditTaskModal();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/edit task/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { summaryInput, descriptionInput, statusSelect } = setupModalForm();
    expect(summaryInput.value).toBe(task.summary);
    expect(descriptionInput.value).toBe(task.description);
    expect(statusSelect.value).toBe(task.status.toLowerCase());
    expect(
      await screen.findByText(task.assignee?.full_name as string)
    ).toBeInTheDocument();
  });

  it("should submit the form if valid", async () => {
    const { task, onHide } = renderEditTaskModal();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

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
    renderEditTaskModal();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { changeSummaryInput, clickSubmit } = setupModalForm();
    changeSummaryInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/summary is required/i)).toBeInTheDocument();

    changeSummaryInput("__test_error_input__");
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/__test_error_description__/i)
    ).toBeInTheDocument();
  });
});
