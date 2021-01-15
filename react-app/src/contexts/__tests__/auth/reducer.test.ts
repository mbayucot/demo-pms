import faker from "faker";

import reducer from "../../auth/reducer";
import { initialAuthState } from "../../auth/state";
import { User } from "../../../types";

describe("reducer", () => {
  let user: User;

  beforeEach(() => {
    user = {
      id: 1,
      email: faker.internet.email(),
      role: "client",
    };
  });

  it("should handle login start state", async () => {
    expect(reducer(initialAuthState, { type: "LOGIN_STARTED" })).toEqual({
      ...initialAuthState,
      isLoading: true,
    });
  });

  it("should handle login complete state", async () => {
    const payload = { user };
    expect(
      reducer(initialAuthState, { type: "LOGIN_COMPLETE", ...payload })
    ).toEqual({
      ...initialAuthState,
      isAuthenticated: true,
      isLoading: false,
      ...payload,
    });
  });

  it("should handle user updated state", async () => {
    const payload = { user };
    expect(
      reducer(initialAuthState, { type: "USER_UPDATED", ...payload })
    ).toEqual({
      ...initialAuthState,
      isAuthenticated: true,
      ...payload,
    });
  });

  it("should handle logout state", async () => {
    expect(reducer(initialAuthState, { type: "LOGOUT" })).toEqual({
      ...initialAuthState,
      isAuthenticated: false,
      user: undefined,
    });
  });

  it("should handle error state", async () => {
    const payload = { error: "__test_error_input__" };
    expect(reducer(initialAuthState, { type: "ERROR", ...payload })).toEqual({
      ...initialAuthState,
      isLoading: false,
      isAuthenticated: false,
      ...payload,
    });
  });
});
