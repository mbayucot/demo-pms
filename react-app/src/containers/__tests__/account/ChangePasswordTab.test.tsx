import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import faker from "faker";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

import SettingsPage from "../../account/SettingsPage";
import { handlers } from "../../__mocks__/user";

const setup = () => {
  const url = "/users/update_password";
  const utils = render(<SettingsPage />);
  const changeOldPasswordInput = (value: string) =>
    userEvent.type(utils.getByLabelText(/old password/i), value);
  const changeNewPasswordInput = (value: string) =>
    userEvent.type(utils.getByLabelText("New Password"), value);
  const changeConfirmPasswordInput = (value: string) =>
    userEvent.type(utils.getByLabelText("Confirm New Password"), value);
  const submitButton = utils.getByRole("button", {
    name: /Save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  const oldPassword = faker.internet.password();
  const newPassword = faker.internet.password();
  return {
    url,
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
      screen.getByRole("heading", { name: /Change password/i })
    ).toBeInTheDocument();
  });

  it("should show validation errors if invalid", async () => {
    const { changeOldPasswordInput, clickSubmit } = setup();
    await changeOldPasswordInput("");
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(screen.getByText(/Old password is required/)).toBeDefined();
      expect(screen.getByText(/New password is required/)).toBeDefined();
      expect(screen.getByText(/Confirm password is required/)).toBeDefined();
    });
  });

  it("should submit the form if valid", async () => {
    const {
      submitButton,
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

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    expect(screen.getByText("password change successful")).toBeInTheDocument();
  });

  it("should show error messages if form is invalid", async () => {
    const {
      url,
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

    server.use(
      rest.post(url, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({ old_password: "password change error" })
        );
      })
    );

    await waitFor(() => {
      expect(screen.getByText("password change error")).toBeInTheDocument();
    });
  });
});
