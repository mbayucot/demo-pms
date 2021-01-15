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
import faker from "faker";

import NewUserModal from "../../../admin/users/NewUserModal";

import { handlers } from "../../../__mocks__/admin/user";
import { data as userData } from "../../../../fixtures/user";

const renderNewUserModal = () => {
  const onHide = jest.fn();
  const props = {
    id: 1,
    onHide,
  };
  const user = userData.entries[0];
  const password = `${faker.internet.password()}!`;
  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <NewUserModal {...props} />
    </SWRConfig>
  );
  return {
    onHide,
    user,
    password,
  };
};

const setupModalForm = () => {
  const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
  const firstNameInput = screen.getByLabelText(
    /first name/i
  ) as HTMLInputElement;
  const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;
  const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
  const roleSelect = screen.getByLabelText(/role/i) as HTMLSelectElement;
  const changeEmailInput = (value: string) =>
    fireEvent.change(emailInput, { target: { value: value } });
  const changeFirstNameInput = (value: string) =>
    fireEvent.change(firstNameInput, { target: { value: value } });
  const changeLastNameInput = (value: string) =>
    fireEvent.change(lastNameInput, { target: { value: value } });
  const changeRoleSelect = (value: string) =>
    fireEvent.change(roleSelect, { target: { value: value } });
  const changePasswordInput = (value: string) =>
    fireEvent.change(passwordInput, { target: { value: value } });
  const submitButton = screen.getByRole("button", {
    name: /save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    emailInput,
    firstNameInput,
    lastNameInput,
    roleSelect,
    submitButton,
    changeEmailInput,
    changeFirstNameInput,
    changeLastNameInput,
    changeRoleSelect,
    changePasswordInput,
    clickSubmit,
  };
};

describe("NewUserModal", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render new user modal", async () => {
    renderNewUserModal();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/new user/i)).toBeInTheDocument();
  });

  it("should submit the form if valid", async () => {
    const { user, password, onHide } = renderNewUserModal();

    const {
      changeEmailInput,
      changeFirstNameInput,
      changeLastNameInput,
      changeRoleSelect,
      changePasswordInput,
      clickSubmit,
    } = setupModalForm();
    changeEmailInput(user.email);
    changeFirstNameInput(user.first_name);
    changeLastNameInput(user.last_name);
    changeRoleSelect(user.role);
    changePasswordInput(password);
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });

  it("should show error messages if form is invalid", async () => {
    const { user, password } = renderNewUserModal();

    const {
      changeEmailInput,
      changeFirstNameInput,
      changeLastNameInput,
      changeRoleSelect,
      changePasswordInput,
      clickSubmit,
    } = setupModalForm();
    changeFirstNameInput("");
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/first name is required/i)
    ).toBeInTheDocument();

    changeEmailInput(user.email);
    changeFirstNameInput("__test_error_input__");
    changeLastNameInput(user.last_name);
    changeRoleSelect(user.role);
    changePasswordInput(password);
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/__test_error_description__/i)
    ).toBeInTheDocument();
  });
});
