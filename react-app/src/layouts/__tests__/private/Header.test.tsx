import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";
import axios from "axios";

import Header from "../../private/Header";
import AuthProvider from "../../../contexts/auth/AuthProvider";

const mockAdapter = new MockAdapter(axios);

const setup = () => {
  const utils = render(
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route path="/">
            <p>landing page</p>
          </Route>
        </Switch>
        <Header />
      </AuthProvider>
    </BrowserRouter>
  );
  const clickSignOut = () => userEvent.click(utils.getByText(/Sign out/i));
  return { clickSignOut };
};

describe("Header", () => {
  it("should render menu and redirect to landing page on logout", async () => {
    const { clickSignOut } = setup();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    clickSignOut();
    mockAdapter.onDelete("/logout").reply(200);
    await waitFor(() => {
      expect(screen.getByText("landing page")).toBeInTheDocument();
    });
  });
});
