import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import faker from "faker";
import { setupServer } from "msw/node";

import LoginPage from "../LoginPage";
import { AuthProvider } from "../../contexts/auth";

import { handlers } from "../../contexts/__mocks__/auth";

const setup = () => {
  const utils = render(
    <AuthProvider>
      <BrowserRouter>
        <LoginPage />
        <Switch>
          <Route path="/projects">
            <p>projects page</p>
          </Route>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
  const changeEmailInput = (value: string) =>
    userEvent.type(utils.getByLabelText(/email address/i), value);
  const changePasswordInput = (value: string) =>
    userEvent.type(utils.getByLabelText(/password/i), value);
  const submitButton = utils.getByRole("button", {
    name: /sign in/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  return {
    submitButton,
    user,
    changeEmailInput,
    changePasswordInput,
    clickSubmit,
  };
};

describe("LoginPage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render page", () => {
    setup();
    expect(
      screen.getByRole("heading", { name: /sign in to account/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /forgot password\?/i,
      })
    ).toHaveAttribute("href", "/password_reset");
  });

  it("should submit the form if valid", async () => {
    const {
      submitButton,
      user,
      changeEmailInput,
      changePasswordInput,
      clickSubmit,
    } = setup();
    await changeEmailInput(user.email);
    await changePasswordInput(user.password);
    clickSubmit();
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    expect(await screen.findByText(/projects page/i)).toBeInTheDocument();
  });

  it("should show error messages if form is invalid", async () => {
    const {
      user,
      changeEmailInput,
      changePasswordInput,
      clickSubmit,
    } = setup();
    await changePasswordInput(" ");
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is too short/i)).toBeInTheDocument();
    });

    await changeEmailInput("invalid@email.com");
    await changePasswordInput(user.password);
    clickSubmit();
    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password./i)
      ).toBeInTheDocument();
    });
  });
});
