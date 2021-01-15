import React, { useContext } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { setupServer } from "msw/node";

import AuthProvider from "../../auth/AuthProvider";
import AuthContext from "../../auth/AuthContext";
import { handlers } from "../../__mocks__/auth";
import { client } from "../../../fixtures/user";

Object.defineProperty(window.document, "cookie", {
  writable: true,
  value: "token=__token__",
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const setup = () => {
  const { result, waitForNextUpdate } = renderHook(
    () => useContext(AuthContext),
    { wrapper }
  );
  const user = client;
  const invalidEmail = "invalid@email.com";
  const errorMsg = "Invalid email or password.";
  const domain = "client";
  return { result, user, invalidEmail, errorMsg, domain, waitForNextUpdate };
};

describe("AuthProvider", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should provide the register, login, logout and updateUser methods", () => {
    const { result } = setup();
    expect(result.current).toBeDefined();
    expect(result.current.register).toBeInstanceOf(Function);
    expect(result.current.login).toBeInstanceOf(Function);
    expect(result.current.logout).toBeInstanceOf(Function);
    expect(result.current.updateUser).toBeInstanceOf(Function);
  });

  it("should update auth state with successful register", async () => {
    const { result, waitForNextUpdate, user } = setup();
    act(() => {
      result.current.register(user);
    });
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe(user.email);
    expect(document.cookie).toMatch("token=__test_token__");
  });

  it("should update auth state with successful login", async () => {
    const { result, waitForNextUpdate, user, domain } = setup();
    act(() => {
      result.current.login(user, domain);
    });
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toEqual(true);
    expect(result.current.user?.email).toEqual(user.email);
    expect(document.cookie).toMatch("token=__test_token__");
  });

  it("should update auth state with successful logout", async () => {
    const { result, waitForNextUpdate } = setup();
    act(() => {
      result.current.logout();
    });
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.user).toBeUndefined();
    expect(document.cookie).toMatch("token=");
  });

  it("should handle register errors", async () => {
    const { result, user, invalidEmail, errorMsg, waitForNextUpdate } = setup();
    user.email = invalidEmail;
    act(() => {
      result.current.register(user);
    });
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.error).toEqual(errorMsg);
  });

  it("should handle login errors", async () => {
    const {
      result,
      user,
      domain,
      invalidEmail,
      errorMsg,
      waitForNextUpdate,
    } = setup();
    user.email = invalidEmail;
    act(() => {
      result.current.login(user, domain);
    });
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.error).toEqual(errorMsg);
  });
});
