import React from "react";
import { render, screen } from "@testing-library/react";

import Footer from "../../public/Footer";

describe("Footer", () => {
  it("should render footer", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2020 demo/i)).toBeInTheDocument();
  });
});
