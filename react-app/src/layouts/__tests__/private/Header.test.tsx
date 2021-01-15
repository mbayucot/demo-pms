import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { setupServer } from "msw/node";

import Header from "../../private/Header";
import { AuthProvider } from "../../../contexts/auth";
import { AbilityContext, defineAbilityFor } from "../../../config/can";

import { handlers } from "../../../contexts/__mocks__/auth";
import { User } from "../../../types";
import { client, admin, staff } from "../../../fixtures/user";

const setup = (user: User) => {
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
  const accountMenu = utils.container.querySelector(
    "#account-dropdown"
  ) as HTMLButtonElement;
  const clickAccountMenu = () => userEvent.click(accountMenu);
  return { utils, clickAccountMenu };
};

describe("Header", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render client menu", async () => {
    setup(client);
    expect((screen.getByText(/projects/i) as HTMLAnchorElement).href).toMatch(
      "/projects"
    );
  });

  it("should render admin menu", async () => {
    setup(admin);
    expect((screen.getByText(/projects/i) as HTMLAnchorElement).href).toMatch(
      "/admin/projects"
    );
    expect((screen.getByText(/users/i) as HTMLAnchorElement).href).toMatch(
      "/admin/users"
    );
  });

  it("should render staff menu", async () => {
    setup(staff);
    expect((screen.getByText(/projects/i) as HTMLAnchorElement).href).toMatch(
      "/admin/projects"
    );
  });

  it("should render account menu", async () => {
    const { clickAccountMenu } = setup(client);
    clickAccountMenu();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it("should handle sign out", async () => {
    const { utils, clickAccountMenu } = setup(client);
    clickAccountMenu();
    await act(async () => {
      userEvent.click(utils.getByText(/sign out/i));
    });
    await waitFor(() => {
      expect(screen.getByText("landing page")).toBeInTheDocument();
    });
  });
});
