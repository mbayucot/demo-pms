import { User } from "../../types";

export interface AuthState {
  error?: string;
  isAuthenticated: boolean;
  isLoading?: boolean;
  user?: User;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
};
