import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { cache } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";

import NewTaskModal from "../../../client/tasks/NewTaskModal";

import {
  handlers as taskHandler,
  data as taskData,
} from "../../../__mocks__/task";
import { handlers as userHandler } from "../../../__mocks__/user";

const renderNewTaskModal = () => {
  const onHide = jest.fn();

  const props = {
    projectId: 1,
    onHide,
  };
  const url = `/projects/${props.projectId}/tasks`;
  const task = taskData.entries[0];

  render(<NewTaskModal {...props} />);
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
    changeSummaryInput,
    changeDescriptionInput,
    changeStatusInput,
    clickSubmit,
  };
};

describe("NewTaskModal", () => {
  const server = setupServer(...taskHandler, ...userHandler);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should show new task modal and user info", async () => {
    const { task, onHide } = renderNewTaskModal();
    expect(screen.getByText(/New Task/i)).toBeInTheDocument();

    const {
      changeSummaryInput,
      changeDescriptionInput,
      changeStatusInput,
      clickSubmit,
    } = await setupModalForm();

    changeSummaryInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/Summary is required/)).toBeDefined();
    expect(await screen.findByText(/Description is required/)).toBeDefined();
    expect(await screen.findByText(/Status is required/)).toBeDefined();

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

  it("should show new task modal and error message", async () => {
    const { url, task, onHide } = renderNewTaskModal();
    const {
      changeSummaryInput,
      changeDescriptionInput,
      changeStatusInput,
      clickSubmit,
    } = await setupModalForm();

    server.use(
      rest.post(url, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({ summary: "task already exists" })
        );
      })
    );

    changeSummaryInput(task.summary);
    changeDescriptionInput(task.description);
    changeStatusInput(task.status);
    act(() => {
      clickSubmit();
    });

    expect(await screen.findByText(/task already exists/)).toBeInTheDocument();
    await waitFor(() => {
      expect(onHide).not.toHaveBeenCalledWith();
    });
  });
});
