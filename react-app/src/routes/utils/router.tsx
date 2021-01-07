import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../contexts/auth";

export const renderWithRouter = (
  ui: React.ReactElement,
  { route = "/" } = {}
) => {
  window.history.pushState({}, "Test page", route);

  return render(<AuthProvider>{ui}</AuthProvider>, { wrapper: BrowserRouter });
};
