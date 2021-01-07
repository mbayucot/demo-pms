import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import faker from "faker";
import userEvent from "@testing-library/user-event";
import { cache } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";

import ResetPasswordPage from "../ResetPasswordPage";
import { handlers } from "../__mocks__/user";

const setup = () => {
  const url = `/users/password`;
  const utils = render(
    <BrowserRouter>
      <ResetPasswordPage />
    </BrowserRouter>
  );
  const changeNewPasswordInput = (value: string) =>
    userEvent.type(utils.getByLabelText(/New Password/i), value);
  const changeConfirmPasswordInput = (value: string) =>
    userEvent.type(utils.getByLabelText(/Confirm Password/i), value);
  const submitButton = utils.getByRole("button", {
    name: /Save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    url,
    submitButton,
    changeNewPasswordInput,
    changeConfirmPasswordInput,
    clickSubmit,
  };
};

describe("ResetPasswordPage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    cache.clear();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render page", () => {
    setup();
    expect(
      screen.getByRole("heading", { name: /Reset your password/i })
    ).toBeInTheDocument();
  });

  it("should show validation errors if invalid", async () => {
    const { clickSubmit } = setup();
    clickSubmit();
    await waitFor(() => {
      expect(screen.getByText(/New password is required/)).toBeDefined();
      expect(screen.getByText(/Confirm password is required/)).toBeDefined();
    });
  });

  it("should submit the form if valid and redirect to projects page", async () => {
    const {
      submitButton,
      changeNewPasswordInput,
      changeConfirmPasswordInput,
      clickSubmit,
      url,
    } = setup();
    await changeNewPasswordInput(faker.internet.password());
    await changeConfirmPasswordInput(faker.internet.password());
    clickSubmit();

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    expect(
      screen.getByText("Password changed successfully!")
    ).toBeInTheDocument();
  });

  it("should show error messages if form is invalid", async () => {
    const {
      changeNewPasswordInput,
      changeConfirmPasswordInput,
      clickSubmit,
      url,
    } = setup();
    await changeNewPasswordInput(faker.internet.password());
    await changeConfirmPasswordInput(faker.internet.password());
    clickSubmit();

    server.use(
      rest.post(url, (req, res, ctx) => {
        return res.once(
          ctx.status(404),
          ctx.json({
            new_password: "Password is invalid",
          })
        );
      })
    );

    await waitFor(() => {
      expect(screen.getByText("Password is invalid")).toBeInTheDocument();
    });
  });
});
