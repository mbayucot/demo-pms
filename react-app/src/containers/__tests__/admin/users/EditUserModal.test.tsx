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

import EditUserModal from "../../../admin/users/EditUserModal";

import { handlers } from "../../../__mocks__/admin/user";
import { data as userData } from "../../../../fixtures/user";

const renderEditUserModal = () => {
  const onHide = jest.fn();
  const props = {
    id: 1,
    onHide,
  };
  const user = userData.entries[0];
  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <EditUserModal {...props} />
    </SWRConfig>
  );
  return {
    onHide,
    user,
  };
};

const setupModalForm = () => {
  const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
  const firstNameInput = screen.getByLabelText(
    /first name/i
  ) as HTMLInputElement;
  const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;
  const roleInput = screen.getByLabelText(/role/i) as HTMLSelectElement;
  const changeEmailInput = (value: string) =>
    fireEvent.change(emailInput, { target: { value: value } });
  const changeFirstNameInput = (value: string) =>
    fireEvent.change(firstNameInput, { target: { value: value } });
  const changeLastNameInput = (value: string) =>
    fireEvent.change(lastNameInput, { target: { value: value } });
  const changeRoleInput = (value: string) =>
    fireEvent.change(roleInput, { target: { value: value } });
  const submitButton = screen.getByRole("button", {
    name: /save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    emailInput,
    firstNameInput,
    lastNameInput,
    roleInput,
    submitButton,
    changeEmailInput,
    changeFirstNameInput,
    changeLastNameInput,
    changeRoleInput,
    clickSubmit,
  };
};

describe("EditUserModal", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
  });

  it("should render edit project modal and show info", async () => {
    const { user } = renderEditUserModal();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/edit user/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const {
      emailInput,
      firstNameInput,
      lastNameInput,
      roleInput,
    } = setupModalForm();
    expect(emailInput.value).toBe(user.email);
    expect(firstNameInput.value).toBe(user.first_name);
    expect(lastNameInput.value).toBe(user.last_name);
    expect(roleInput.value).toBe(user.role);
  });

  it("should submit the form if valid", async () => {
    const { user, onHide } = renderEditUserModal();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { changeEmailInput, clickSubmit } = setupModalForm();
    changeEmailInput(user.email);
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });

  it("should show error messages if form is invalid", async () => {
    renderEditUserModal();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { changeFirstNameInput, clickSubmit } = setupModalForm();
    changeFirstNameInput("");
    await act(async () => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/first name is required/i)
    ).toBeInTheDocument();

    changeFirstNameInput("__test_error_input__");
    await act(async () => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/__test_error_description__/i)
    ).toBeInTheDocument();
  });
});
