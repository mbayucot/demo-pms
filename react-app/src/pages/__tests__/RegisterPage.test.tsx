import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import { setupServer } from "msw/node";
import { cache } from "swr";
import { rest } from "msw";

import { AuthProvider } from "../../contexts/auth";
import RegisterPage from "../RegisterPage";
import { handlers } from "../../contexts/__mocks__/auth";

const setup = () => {
  const url = `/signup`;
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
    url,
    submitButton,
    user,
    changeUsernameInput,
    changePasswordInput,
    clickSubmit,
  };
};

describe("RegisterPage", () => {
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
      screen.getByRole("heading", { name: /create your account/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should show validation errors if invalid", async () => {
    const { changeUsernameInput } = setup();
    await changeUsernameInput(" ");
    await waitFor(() => {
      expect(screen.getByText(/Email is invalid/)).toBeDefined();
      expect(screen.getByText(/Password is required/)).toBeDefined();
    });
  });

  it("should submit the form if valid and redirect to projects page", async () => {
    const {
      url,
      submitButton,
      user,
      changeUsernameInput,
      changePasswordInput,
      clickSubmit,
    } = setup();
    await changeUsernameInput(user.email);
    await changePasswordInput(user.password);
    clickSubmit();

    await waitFor(() => {
      expect(submitButton).toHaveTextContent("Create Account");
      expect(submitButton).toBeDisabled();
    });

    expect(await screen.findByText("projects page")).toBeInTheDocument();
  });

  it("should show error messages if form is invalid", async () => {
    const {
      url,
      user,
      changeUsernameInput,
      changePasswordInput,
      clickSubmit,
    } = setup();
    await changeUsernameInput(user.email);
    await changePasswordInput(user.password);
    clickSubmit();

    server.use(
      rest.post(url, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({
            error: "Email already exist",
          })
        );
      })
    );

    await waitFor(() => {
      expect(screen.getByText("Email already exist")).toBeInTheDocument();
    });
  });
});
