import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import ErrorFallbackPage from "../ErrorFallbackPage";

const setup = () => {
  const resetErrorBoundary = jest.fn();
  const error: Error = new Error("__test_error__");
  const props = {
    error,
    resetErrorBoundary,
  };
  const utils = render(
    <BrowserRouter>
      <ErrorFallbackPage {...props} />
    </BrowserRouter>
  );
  const clickTryAgain = () => userEvent.click(utils.getByText(/try again/i));
  return { resetErrorBoundary, clickTryAgain };
};

describe("ErrorFallbackPage", () => {
  it("should render page and reset error on try again click", async () => {
    const { resetErrorBoundary, clickTryAgain } = setup();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    clickTryAgain();
    expect(resetErrorBoundary).toHaveBeenCalledTimes(1);
  });
});
