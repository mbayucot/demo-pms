import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import { setupServer } from "msw/node";
import { cache } from "swr";

import Header from "../../private/Header";
import { AuthProvider, User } from "../../../contexts/auth";
import { AbilityContext, defineAbilityFor } from "../../../config/can";
import { rest } from "msw";

const setup = (role: string) => {
  const user = {
    id: 1,
    email: faker.internet.email(),
    role: role,
  } as User;
  const ability = defineAbilityFor(user);
  const utils = render(
    <BrowserRouter>
      <AuthProvider>
        <AbilityContext.Provider value={ability}>
          <Switch>
            <Route path="/">
              <p>landing page</p>
            </Route>
          </Switch>
          <Header />
        </AbilityContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
  const clickSignOut = () => userEvent.click(utils.getByText(/Sign out/i));
  return { clickSignOut };
};

describe("Header", () => {
  const server = setupServer(
    rest.delete(`/logout`, (req, res, ctx) => {
      return res(ctx.status(200));
    })
  );

  beforeAll(() => server.listen());

  afterEach(() => {
    cache.clear();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render client menu and redirect to landing page on logout", async () => {
    const { clickSignOut } = setup("client");
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    await act(async () => {
      clickSignOut();
    });

    await waitFor(() => {
      expect(screen.getByText("landing page")).toBeInTheDocument();
    });
  });

  it("should render admin menu and redirect to landing page on logout", async () => {
    setup("admin");
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("should render staff menu and redirect to landing page on logout", async () => {
    setup("staff");
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });
});
