import React, { FC } from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import AxiosHandler from "../../axios/AxiosHandler";

describe("AxiosHandler", () => {
  it("should wrap a class component", () => {
    const MyComponent: FC = () => {
      return <p>My Component</p>;
    };
    render(
      <BrowserRouter>
        <AxiosHandler>
          <MyComponent />
        </AxiosHandler>
      </BrowserRouter>
    );
    expect(screen.getByText("My Component")).toBeInTheDocument();
  });
});
