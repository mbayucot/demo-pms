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
import selectEvent from "react-select-event";
import { SWRConfig, cache } from "swr";
import { setupServer } from "msw/node";

import EditProjectModal from "../../../admin/projects/EditProjectModal";

import { handlers as projectHandlers } from "../../../__mocks__/admin/project";
import { handlers as userHandlers } from "../../../../api/__mocks__/user";
import { data as projectData } from "../../../../fixtures/project";

const renderEditProjectModal = () => {
  const onHide = jest.fn();
  const props = {
    id: 1,
    isAdmin: true,
    onHide,
  };
  const project = projectData.entries[0];
  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <EditProjectModal {...props} />
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

describe("EditProjectModal", () => {
  const server = setupServer(...projectHandlers, ...userHandlers);

  beforeAll(() => server.listen());

  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
  });

  it("should show edit user modal and user info", async () => {
    const { project } = renderEditProjectModal();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/edit project/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { nameInput } = setupModalForm();
    expect(nameInput.value).toBe(project.name);
    expect(
      await screen.findByText(project.client?.full_name as string)
    ).toBeInTheDocument();
  });

  it("should submit the form if valid", async () => {
    const { project, onHide } = renderEditProjectModal();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { changeNameInput, clickSubmit } = setupModalForm();
    changeNameInput(project.name);
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });

  it("should show error messages if form is invalid", async () => {
    renderEditProjectModal();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { changeNameInput, clickSubmit } = setupModalForm();
    changeNameInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

    changeNameInput("__test_error_input__");
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/__test_error_description__/i)
    ).toBeInTheDocument();
  });
});
