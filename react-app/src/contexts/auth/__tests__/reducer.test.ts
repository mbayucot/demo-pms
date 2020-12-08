import faker from "faker";

import { reducer } from "../reducer";
import { initialAuthState } from "../state";

describe("reducer", () => {
  it("should update state when authenticated", async () => {
    const payload = {
      isAuthenticated: true,
      user: {
        email: faker.internet.email(),
      },
    };
    expect(
      reducer(initialAuthState, { type: "LOGIN_COMPLETE", ...payload })
    ).toEqual({
      ...initialAuthState,
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
      isLoading: false,
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
