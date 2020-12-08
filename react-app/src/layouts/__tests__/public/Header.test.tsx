import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Header from "../../public/Header";

describe("Header", () => {
  it("should render header", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    screen.getByRole("img", { name: /demo logo/i });
    screen.getByRole("link", { name: /pricing/i });
    screen.getByRole("link", { name: /blog/i });
    screen.getByRole("link", { name: /contact us/i });
    screen.getByRole("link", { name: /log in/i });
    screen.getByRole("link", { name: /sign up/i });
  });
});
