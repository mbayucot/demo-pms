import React, { useContext } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import faker from "faker";

import AuthProvider from "../AuthProvider";
import AuthContext from "../AuthContext";

const mockAdapter = new MockAdapter(axios);
Object.defineProperty(window.document, "cookie", {
  writable: true,
  value: "token=__token__",
});

const setup = () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );
  const { result, waitForNextUpdate } = renderHook(
    () => useContext(AuthContext),
    { wrapper }
  );

  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  const data = { email: user.email };
  const error = { error: "__test_error__" };
  const headers = {
    authorization: "__token__",
  };

  return { result, waitForNextUpdate, user, data, error, headers };
};

describe("AuthProvider", () => {
  afterEach(() => {
    mockAdapter.resetHandlers();
  });

  it("should provide the AuthProvider result and register, login, logout methods", () => {
    const { result } = setup();
    expect(result.current).toBeDefined();
    expect(result.current.register).toBeInstanceOf(Function);
    expect(result.current.login).toBeInstanceOf(Function);
    expect(result.current.logout).toBeInstanceOf(Function);
  });

  it("should update auth state after register", async () => {
    const { result, waitForNextUpdate, user, data, headers } = setup();
    act(() => {
      result.current.register(user);
    });
    mockAdapter.onPost("/signup").reply(200, data, headers);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe(user.email);
    expect(document.cookie).toMatch("token=__token__");
  });

  it("should handle register errors", async () => {
    const { result, user, error } = setup();
    mockAdapter.onPost("/signup").reply(422, error);
    await act(async () => {
      await expect(result.current.register(user)).rejects.toThrow(
        "__test_error__"
      );
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.error).toEqual("__test_error__");
  });

  it("should update auth state after login", async () => {
    const { result, waitForNextUpdate, user, data, headers } = setup();
    act(() => {
      result.current.login(user);
    });
    mockAdapter.onPost("/login").reply(200, data, headers);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toEqual(true);
    expect(result.current.user?.email).toEqual(user.email);
    expect(document.cookie).toMatch("token=__token__");
  });

  it("should handle login errors", async () => {
    const { result, user, error } = setup();
    mockAdapter.onPost("/login").reply(422, error);
    await act(async () => {
      await expect(result.current.login(user)).rejects.toThrow(
        "__test_error__"
      );
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.error).toEqual("__test_error__");
  });

  it("should update auth state after logout", async () => {
    const { result, waitForNextUpdate } = setup();
    act(() => {
      result.current.logout();
    });
    mockAdapter.onDelete("/logout").reply(200);
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.user).toBeUndefined();
    expect(document.cookie).toMatch("token=");
  });

  it("should handle logout errors", async () => {
    const { result, waitForNextUpdate, error } = setup();
    act(() => {
      result.current.logout();
    });
    mockAdapter.onDelete("/logout").reply(500, error);
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.error).toEqual("__test_error__");
  });
});
