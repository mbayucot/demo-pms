import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import faker from "faker";
import userEvent from "@testing-library/user-event";
import { cache } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";

import LoginPage from "../LoginPage";
import { AuthProvider } from "../../contexts/auth";
import { handlers } from "../../contexts/__mocks__/auth";

const setup = () => {
  const url = `/login`;
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
    url,
    submitButton,
    user,
    changeUsernameInput,
    changePasswordInput,
    clickSubmit,
  };
};

describe("LoginPage", () => {
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
      expect(screen.getByText(/Email is invalid/)).toBeDefined();
      expect(screen.getByText(/Password is required/)).toBeDefined();
    });
  });

  it("should submit the form if valid and redirect to tasks page", async () => {
    const {
      submitButton,
      user,
      changeUsernameInput,
      changePasswordInput,
      clickSubmit,
      url,
    } = setup();
    await changeUsernameInput(user.email);
    await changePasswordInput(user.password);
    clickSubmit();

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    expect(await screen.findByText("projects page")).toBeInTheDocument();
  });

  it("should show error messages if form is invalid", async () => {
    const {
      user,
      changeUsernameInput,
      changePasswordInput,
      clickSubmit,
      url,
    } = setup();
    await changeUsernameInput(user.email);
    await changePasswordInput(user.password);
    clickSubmit();

    server.use(
      rest.post(url, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({
            error: "Login failed",
          })
        );
      })
    );

    await waitFor(() => {
      expect(screen.getByText("Login failed")).toBeInTheDocument();
    });
  });
});
