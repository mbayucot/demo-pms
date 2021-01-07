import React, { FC } from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Layout from "../../auth/Layout";

describe("Layout", () => {
  it("should wrap a class component", () => {
    const MyComponent: FC = () => {
      return <p>My Component</p>;
    };
    render(
      <BrowserRouter>
        <Layout>
          <MyComponent />
        </Layout>
      </BrowserRouter>
    );
    expect(screen.getByText("My Component")).toBeInTheDocument();
  });
});
