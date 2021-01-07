import { AuthState } from "./state";
import { User } from "../../types";

type Action =
  | { type: "LOGIN_STARTED" }
  | {
      type: "LOGIN_COMPLETE" | "USER_UPDATED";
      user: User;
    }
  | { type: "LOGOUT" }
  | { type: "ERROR"; error: string };

const reducer = (state: AuthState, action: Action): AuthState => {
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
    case "USER_UPDATED":
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user,
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
    default:
      throw new Error();
  }
};

export default reducer;
