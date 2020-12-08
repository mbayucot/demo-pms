import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import LandingPage from "../landing/LandingPage";

describe("LandingPage", () => {
  it("should render page", () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    expect(
      screen.getByRole("heading", { name: /Lorem ipsum dolor sit amet/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /get started/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /contact us/i })
    ).toBeInTheDocument();
  });
});
