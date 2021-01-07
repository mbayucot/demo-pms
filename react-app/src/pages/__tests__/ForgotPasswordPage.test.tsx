import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import faker from "faker";
import userEvent from "@testing-library/user-event";
import { cache } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";

import ForgotPasswordPage from "../ForgotPasswordPage";

const setup = () => {
  const url = `/forgot_password`;
  const utils = render(
    <BrowserRouter>
      <ForgotPasswordPage />
    </BrowserRouter>
  );
  const changeEmailInput = (value: string) =>
    userEvent.type(
      utils.getByPlaceholderText(/Enter your email address/i),
      value
    );
  const submitButton = utils.getByRole("button", {
    name: /Send password reset email/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    url,
    submitButton,
    changeEmailInput,
    clickSubmit,
  };
};

describe("ForgotPasswordPage", () => {
  const server = setupServer();

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
      expect(screen.getByText(/Email is required/)).toBeDefined();
    });
  });

  it("should submit the form if valid and redirect to projects page", async () => {
    const { submitButton, changeEmailInput, clickSubmit, url } = setup();
    await changeEmailInput(faker.internet.email());
    clickSubmit();

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    expect(
      screen.getByText("Forgot password successful. Please check your email.")
    ).toBeInTheDocument();
  });

  it("should show error messages if form is invalid", async () => {
    const { changeEmailInput, clickSubmit, url } = setup();
    await changeEmailInput(faker.internet.email());
    clickSubmit();

    server.use(
      rest.post(url, (req, res, ctx) => {
        return res.once(
          ctx.status(404),
          ctx.json({
            email: "Email does not exists",
          })
        );
      })
    );

    await waitFor(() => {
      expect(screen.getByText("Email does not exists")).toBeInTheDocument();
    });
  });
});
