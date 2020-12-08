import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import AuthProvider from "../../contexts/auth/AuthProvider";
import RegisterPage from "../RegisterPage";

const mockAdapter = new MockAdapter(axios);

const setup = () => {
  const utils = render(
    <AuthProvider>
      <BrowserRouter>
        <RegisterPage />
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
    name: /create account/i,
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

describe("RegisterPage", () => {
  afterEach(() => {
    mockAdapter.resetHandlers();
  });

  it("should render page", () => {
    setup();
    expect(
      screen.getByRole("heading", { name: /create your account/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
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

    mockAdapter.onPost("/signup").reply(
      200,
      {
        email: user.email,
      },
      {
        authorization: "__token__",
      }
    );

    await waitFor(() => {
      expect(submitButton).toHaveTextContent("Creating account..");
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

    mockAdapter.onPost("/signup").reply(422, {
      error: "Email already exist",
    });

    await waitFor(() => {
      expect(screen.getByText("Email already exist")).toBeInTheDocument();
    });
  });
});
