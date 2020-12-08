import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import faker from "faker";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import LoginPage from "../LoginPage";
import AuthProvider from "../../contexts/auth/AuthProvider";

const mockAdapter = new MockAdapter(axios);

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
  const changeUsernameInput = (value: string) =>
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
    changeUsernameInput,
    changePasswordInput,
    clickSubmit,
  };
};

describe("LoginPage", () => {
  afterEach(() => {
    mockAdapter.resetHandlers();
  });

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

    expect(
      screen.getByRole("link", {
        name: /create account/i,
      })
    ).toHaveAttribute("href", "/signup");
  });

  it("should show validation errors if invalid", async () => {
    const { changeUsernameInput } = setup();
    await changeUsernameInput(" ");
    await waitFor(() => {
      expect(screen.getByText(/Email is not valid/)).toBeDefined();
      expect(screen.getByText(/Password is required/)).toBeDefined();
    });
  });

  it("should submit the form if valid and redirect to projects page", async () => {
    const {
      submitButton,
      user,
      changeUsernameInput,
      changePasswordInput,
      clickSubmit,
    } = setup();
    await changeUsernameInput(user.email);
    await changePasswordInput(user.password);
    clickSubmit();

    mockAdapter.onPost("/login").reply(
      200,
      {
        email: user.email,
      },
      {
        authorization: "__token__",
      }
    );

    await waitFor(() => {
      expect(submitButton).toHaveTextContent("Signing in..");
      expect(submitButton).toBeDisabled();
    });

    expect(screen.getByText("projects page")).toBeInTheDocument();
  });

  it("should show error messages if form is invalid", async () => {
    const {
      user,
      changeUsernameInput,
      changePasswordInput,
      clickSubmit,
    } = setup();
    await changeUsernameInput(user.email);
    await changePasswordInput(user.password);
    clickSubmit();

    mockAdapter.onPost("/login").reply(422, {
      error: "Login failed",
    });

    await waitFor(() => {
      expect(screen.getByText("Login failed")).toBeInTheDocument();
    });
  });
});
