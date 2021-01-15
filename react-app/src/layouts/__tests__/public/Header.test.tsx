import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Header from "../../public/Header";

describe("Header", () => {
  it("should render header menu", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    screen.getByRole("img", { name: /demo logo/i });
    const menu = ["Pricing", "Blog", "Contact Us", "Log in", "Sign up"];
    menu.forEach((link) => {
      screen.getByRole("link", { name: link });
    });
  });
});
