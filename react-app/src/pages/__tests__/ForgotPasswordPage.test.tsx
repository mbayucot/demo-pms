import React from "react";
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";

import ForgotPasswordPage from "../ForgotPasswordPage";

import { handlers } from "../__mocks__/user";

const setup = () => {
  const utils = render(
    <BrowserRouter>
      <ForgotPasswordPage />
    </BrowserRouter>
  );
  const emailInput = utils.getByPlaceholderText(/enter your email address/i);
  const changeEmailInput = (value: string) => {
    fireEvent.change(emailInput, { target: { value: value } });
  };
  const submitButton = utils.getByRole("button", {
    name: /send password reset email/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    submitButton,
    changeEmailInput,
    clickSubmit,
  };
};

describe("ForgotPasswordPage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render page", () => {
    setup();
    expect(
      screen.getByRole("heading", { name: /Reset your password/i })
    ).toBeInTheDocument();
  });

  it("should submit the form if valid", async () => {
    const { changeEmailInput, clickSubmit } = setup();
    changeEmailInput(faker.internet.email());
    await act(async () => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          /Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder./i
        )
      ).toBeInTheDocument();
    });
  });

  it("should show error messages if form is invalid", async () => {
    const { changeEmailInput, clickSubmit } = setup();
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    changeEmailInput("invalid@email.com");
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(
        screen.getByText(/__test_error_description__/i)
      ).toBeInTheDocument();
    });
  });
});
