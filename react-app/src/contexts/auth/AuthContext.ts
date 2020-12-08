import { createContext } from "react";

import { AuthState, initialAuthState, User } from "./state";

const stub = (): never => {
  throw new Error("You forgot to wrap your component in <AuthProvider>.");
};

const initialContext = {
  ...initialAuthState,
  register: stub,
  login: stub,
  logout: stub,
};

export interface AuthContextInterface extends AuthState {
  register: (values: User) => Promise<void>;
  login: (values: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface>(initialContext);

export default AuthContext;
