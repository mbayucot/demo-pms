import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

it("should render banner", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  await waitFor(() => {
    const linkElement = screen.getByText(/Lorem ipsum dolor sit amet/i);
    expect(linkElement).toBeInTheDocument();
  });
});
