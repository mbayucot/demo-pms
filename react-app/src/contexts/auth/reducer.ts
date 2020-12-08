import { AuthState, User } from "./state";

type Action =
  | { type: "LOGIN_STARTED" }
  | {
      type: "LOGIN_COMPLETE";
      user?: User;
    }
  | { type: "LOGOUT" }
  | { type: "ERROR"; error: string };

export const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case "LOGIN_STARTED":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGIN_COMPLETE":
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user,
        isLoading: false,
        error: undefined,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
      };
    case "ERROR":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.error,
      };
  }
};
