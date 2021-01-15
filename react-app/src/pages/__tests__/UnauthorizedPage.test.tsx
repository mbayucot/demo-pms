import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import UnAuthorizedPage from "../UnAuthorizedPage";

const setup = () => {
  const utils = render(
    <BrowserRouter>
      <UnAuthorizedPage />
    </BrowserRouter>
  );
  return { utils };
};

describe("UnAuthorizedPage", () => {
  it("should render page and handle back", async () => {
    setup();
    expect(screen.getByText(/authorization required!/i)).toBeInTheDocument();
    expect(
      (screen.getByText(/back to home/i) as HTMLAnchorElement).href
    ).toMatch("/");
  });
});
