import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { SWRConfig } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

import EditTaskModal from "../../../client/tasks/EditTaskModal";

import {
  handlers as taskHandler,
  data as taskData,
} from "../../../__mocks__/task";
import { handlers as userHandler } from "../../../__mocks__/user";

const renderEditTaskModal = () => {
  const onHide = jest.fn();

  const props = {
    id: 1,
    onHide,
  };
  const url = `/tasks/${props.id}`;
  const task = taskData.entries[0];

  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <EditTaskModal {...props} />
    </SWRConfig>
  );
  const error = { name: "__error__" };
  return {
    onHide,
    url,
    task,
    error,
  };
};

const setupModalForm = async () => {
  const summaryInput = screen.getByLabelText(/summary/i) as HTMLInputElement;
  const descriptionInput = screen.getByLabelText(
    /description/i
  ) as HTMLInputElement;
  const statusInput = screen.getByLabelText(/status/i) as HTMLInputElement;
  const assigneeInput = screen.getByLabelText(/assignee/i) as HTMLInputElement;
  const changeSummaryInput = (value: string) =>
    fireEvent.change(summaryInput, { target: { value: value } });
  const changeDescriptionInput = (value: string) =>
    fireEvent.change(descriptionInput, { target: { value: value } });
  const changeStatusInput = (value: string) =>
    fireEvent.change(statusInput, { target: { value: value } });
  const submitButton = screen.getByRole("button", {
    name: /Save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    summaryInput,
    descriptionInput,
    statusInput,
    assigneeInput,
    changeSummaryInput,
    changeDescriptionInput,
    changeStatusInput,
    clickSubmit,
  };
};

describe("EditTaskModal", () => {
  const server = setupServer(...taskHandler, ...userHandler);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should show edit task modal and user info", async () => {
    const { url, task, onHide } = renderEditTaskModal();
    expect(screen.getByText(/Edit Task/i)).toBeInTheDocument();
    expect(screen.getByRole(/status/i)).toHaveTextContent(/loading/i);

    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const {
      summaryInput,
      descriptionInput,
      statusInput,
      changeSummaryInput,
      changeDescriptionInput,
      changeStatusInput,
      clickSubmit,
    } = await setupModalForm();

    expect(summaryInput.value).toBe(task.summary);
    expect(descriptionInput.value).toBe(task.description);
    expect(statusInput.value).toBe(task.status.toLowerCase());
    expect(
      await screen.findByText(task.assignee?.full_name as string)
    ).toBeInTheDocument();

    changeSummaryInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/Summary is required/)).toBeDefined();

    changeSummaryInput(task.summary);
    server.use(
      rest.patch(url, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({ summary: "Summary already exists" })
        );
      })
    );
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/Summary already exists/)).toBeDefined();

    changeSummaryInput(task.summary);
    changeDescriptionInput(task.description);
    changeStatusInput(task.status);
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });
});
