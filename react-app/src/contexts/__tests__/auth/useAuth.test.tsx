import React from "react";
import { renderHook } from "@testing-library/react-hooks";

import useAuth from "../../auth/useAuth";
import AuthProvider from "../../auth/AuthProvider";

describe("useAuth", () => {
  it("should provide the auth context", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const {
      result: { current },
    } = renderHook(useAuth, { wrapper });
    expect(current).toBeDefined();
  });

  it("should throw with no provider", () => {
    const {
      result: { current },
    } = renderHook(useAuth);
    expect(current.login).toThrow(
      "You forgot to wrap your component in <AuthProvider>."
    );
  });
});
