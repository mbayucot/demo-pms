import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import NoMatchPage from "../NoMatchPage";

const setup = () => {
  const utils = render(
    <BrowserRouter>
      <NoMatchPage />
      <Switch>
        <Route path="/">
          <p>landing page</p>
        </Route>
      </Switch>
    </BrowserRouter>
  );
  const clickBackHome = () => userEvent.click(utils.getByText(/Back to Home/i));
  return { clickBackHome };
};

describe("NoMatchPage", () => {
  it("should render page and redirect to landing page on back click", async () => {
    const { clickBackHome } = setup();
    expect(
      screen.getByText(/Oops! That page can’t be found./i)
    ).toBeInTheDocument();
    clickBackHome();
    await waitFor(() => {
      expect(screen.getByText(/landing page/i)).toBeInTheDocument();
    });
  });
});
