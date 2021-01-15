import { createContext } from "react";

import { AuthState, initialAuthState } from "./state";
import { LoginFormValues } from "../../forms/LoginForm";
import { RegisterFormValues } from "../../forms/RegisterForm";
import { User } from "../../types";

const stub = (): never => {
  throw new Error("You forgot to wrap your component in <AuthProvider>.");
};

const initialContext = {
  ...initialAuthState,
  register: stub,
  login: stub,
  logout: stub,
  updateUser: stub,
};

export interface AuthContextInterface extends AuthState {
  register: (values: RegisterFormValues) => Promise<boolean>;
  login: (values: LoginFormValues, domain: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface>(initialContext);

export default AuthContext;
