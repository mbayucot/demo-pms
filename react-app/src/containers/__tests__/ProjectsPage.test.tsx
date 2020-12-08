import React from "react";
import { render, screen } from "@testing-library/react";

import ProjectsPage from "../ProjectsPage";

const setup = () => {
  render(<ProjectsPage />);
};

describe("ProjectsPage", () => {
  it("should render page", () => {
    setup();
    expect(screen.getByText("Projects Page")).toBeInTheDocument();
  });
});
