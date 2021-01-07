import faker from "faker";

import reducer from "../../auth/reducer";
import { initialAuthState, User } from "../../auth/state";

describe("reducer", () => {
  it("should update state when authenticated", async () => {
    const user: User = {
      id: 1,
      email: faker.internet.email(),
      role: "client",
    };
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

  it("should update state when not authenticated", async () => {
    const payload = {
      isAuthenticated: false,
      user: undefined,
    };
    expect(reducer(initialAuthState, { type: "LOGOUT", ...payload })).toEqual({
      ...initialAuthState,
      ...payload,
    });
  });

  it("should handle error state", async () => {
    const payload = { error: "__test_error__" };
    expect(reducer(initialAuthState, { type: "ERROR", ...payload })).toEqual({
      ...initialAuthState,
      isLoading: false,
      ...payload,
    });
  });
});
