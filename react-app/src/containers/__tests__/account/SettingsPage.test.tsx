import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import { setupServer } from "msw/node";

import SettingsPage from "../../account/SettingsPage";
import { handlers } from "../../__mocks__/account/user";

const setup = () => {
  const utils = render(<SettingsPage />);
  const changeOldPasswordInput = (value: string) =>
    userEvent.type(utils.getByLabelText(/old password/i), value);
  const changeNewPasswordInput = (value: string) =>
    userEvent.type(utils.getByLabelText("New password"), value);
  const changeConfirmPasswordInput = (value: string) =>
    userEvent.type(utils.getByLabelText("Confirm new password"), value);
  const submitButton = utils.getByRole("button", {
    name: /update password/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  const oldPassword = `${faker.internet.password()}!`;
  const newPassword = `${faker.internet.password()}!`;
  return {
    submitButton,
    changeOldPasswordInput,
    changeNewPasswordInput,
    changeConfirmPasswordInput,
    clickSubmit,
    oldPassword,
    newPassword,
  };
};

describe("SettingsPage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render page", () => {
    setup();
    expect(
      screen.getByRole("heading", { name: /change password/i })
    ).toBeInTheDocument();
  });

  it("should submit the form if valid", async () => {
    const {
      changeOldPasswordInput,
      changeNewPasswordInput,
      changeConfirmPasswordInput,
      clickSubmit,
      oldPassword,
      newPassword,
    } = setup();
    await changeOldPasswordInput(oldPassword);
    await changeNewPasswordInput(newPassword);
    await changeConfirmPasswordInput(newPassword);
    clickSubmit();
    expect(
      await screen.findByText(/your password has been successfully changed./i)
    ).toBeInTheDocument();
  });

  it("should show error messages if form is invalid", async () => {
    const {
      changeOldPasswordInput,
      changeNewPasswordInput,
      changeConfirmPasswordInput,
      clickSubmit,
      newPassword,
    } = setup();
    await changeOldPasswordInput("");
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/old password is required/i)
    ).toBeInTheDocument();

    await changeOldPasswordInput("__test_error_input__");
    await changeNewPasswordInput(newPassword);
    await changeConfirmPasswordInput(newPassword);
    clickSubmit();
    await waitFor(() => {
      expect(
        screen.getByText(/__test_error_description__/i)
      ).toBeInTheDocument();
    });
  });
});
