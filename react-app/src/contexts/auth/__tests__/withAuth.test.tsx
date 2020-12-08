import { render, screen } from "@testing-library/react";
import React, { Component } from "react";

import withAuth, { WithAuthProps } from "../withAuth";

describe("withAuth", () => {
  it("should wrap a class component", () => {
    class MyComponent extends Component<WithAuthProps> {
      render(): JSX.Element {
        return <>hasAuth: {`${!!this.props.auth}`}</>;
      }
    }
    const WrappedComponent = withAuth(MyComponent);
    render(<WrappedComponent />);
    expect(screen.getByText("hasAuth: true")).toBeInTheDocument();
  });
});
