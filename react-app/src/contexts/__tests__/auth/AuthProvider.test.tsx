import React, { useContext } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import faker from "faker";
import { setupServer } from "msw/node";
import { cache } from "swr";

import AuthProvider from "../../auth/AuthProvider";
import AuthContext from "../../auth/AuthContext";
import { rest } from "msw";

import { handlers } from "../../__mocks__/auth";

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
  const domain = "client";

  return { result, waitForNextUpdate, user, data, error, headers, domain };
};

describe("AuthProvider", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    cache.clear();
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should provide the AuthProvider result and register, login, logout methods", () => {
    const { result } = setup();
    expect(result.current).toBeDefined();
    expect(result.current.register).toBeInstanceOf(Function);
    expect(result.current.login).toBeInstanceOf(Function);
    expect(result.current.logout).toBeInstanceOf(Function);
  });

  it("should update auth state after register", async () => {
    const { result, waitForNextUpdate, user, data } = setup();
    act(() => {
      result.current.register(user);
    });
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe(user.email);
    expect(document.cookie).toMatch("token=__token__");
  });

  it("should handle register errors", async () => {
    const { result, user, error, waitForNextUpdate } = setup();

    server.use(
      rest.post(`/signup`, (req, res, ctx) => {
        return res.once(ctx.status(422), ctx.json(error));
      })
    );

    act(() => {
      result.current.register(user);
    });
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.error).toEqual("__test_error__");
  });

  it("should update auth state after login", async () => {
    const { result, waitForNextUpdate, user, domain } = setup();
    act(() => {
      result.current.login(user, domain);
    });
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toEqual(true);
    expect(result.current.user?.email).toEqual(user.email);
    expect(document.cookie).toMatch("token=__token__");
  });

  it("should handle login errors", async () => {
    const { result, user, error, domain, waitForNextUpdate } = setup();
    server.use(
      rest.post(`/login`, (req, res, ctx) => {
        return res.once(ctx.status(422), ctx.json(error));
      })
    );
    act(() => {
      result.current.login(user, domain);
    });
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.error).toEqual("__test_error__");
  });

  it("should update auth state after logout", async () => {
    const { result, waitForNextUpdate } = setup();
    act(() => {
      result.current.logout();
    });
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
    server.use(
      rest.delete(`/logout`, (req, res, ctx) => {
        return res.once(ctx.status(500), ctx.json(error));
      })
    );
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toEqual(false);
    expect(result.current.error).toEqual("__test_error__");
  });
});
