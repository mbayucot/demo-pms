import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import NoMatchPage from "../NoMatchPage";

const setup = () => {
  const utils = render(
    <BrowserRouter>
      <NoMatchPage />
    </BrowserRouter>
  );
  return { utils };
};

describe("NoMatchPage", () => {
  it("should render page and handle back", async () => {
    setup();
    expect(
      screen.getByText(/oops! that page can’t be found./i)
    ).toBeInTheDocument();
    expect(
      (screen.getByText(/back to home/i) as HTMLAnchorElement).href
    ).toMatch("/");
  });
});
