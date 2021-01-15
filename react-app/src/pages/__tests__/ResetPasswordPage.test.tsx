import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import { setupServer } from "msw/node";
import { BrowserRouter, MemoryRouter, Route } from "react-router-dom";

import ResetPasswordPage from "../ResetPasswordPage";
import { handlers } from "../__mocks__/user";

const setup = () => {
  const utils = render(
    <BrowserRouter>
      <MemoryRouter initialEntries={[`/reset_password/:token`]}>
        <Route path="/reset_password/:token">
          <ResetPasswordPage />
        </Route>
      </MemoryRouter>
    </BrowserRouter>
  );
  const newPasswordInput = utils.getByLabelText(
    /new password/i
  ) as HTMLInputElement;
  const confirmPasswordInput = utils.getByLabelText(
    /confirm password/i
  ) as HTMLInputElement;
  const changeNewPasswordInput = (value: string) =>
    fireEvent.change(newPasswordInput, { target: { value: value } });
  const changeConfirmPasswordInput = (value: string) =>
    fireEvent.change(confirmPasswordInput, { target: { value: value } });
  const submitButton = utils.getByRole("button", {
    name: /reset password/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
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
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render page", () => {
    setup();
    expect(
      screen.getByRole("heading", { name: /reset your password/i })
    ).toBeInTheDocument();
  });

  it("should submit the form if valid", async () => {
    const {
      changeNewPasswordInput,
      changeConfirmPasswordInput,
      clickSubmit,
    } = setup();
    const password = `${faker.internet.password()}!1`;
    changeNewPasswordInput(password);
    changeConfirmPasswordInput(password);
    clickSubmit();
    await waitFor(() => {
      expect(
        screen.getByText(/password changed successfully!/i)
      ).toBeInTheDocument();
    });
  });

  it("should show error messages if form is invalid", async () => {
    const {
      changeNewPasswordInput,
      changeConfirmPasswordInput,
      clickSubmit,
    } = setup();
    clickSubmit();
    await waitFor(() => {
      expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/confirm password is required/i)
      ).toBeInTheDocument();
    });

    const password = "__test_error_input__A1!";
    changeNewPasswordInput(password);
    changeConfirmPasswordInput(password);
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
