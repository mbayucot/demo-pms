import React, { useCallback, useEffect, useReducer } from "react";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

import AuthContext from "./AuthContext";
import reducer from "./reducer";
import { AuthState, initialAuthState } from "./state";
import { LoginFormValues } from "../../forms/LoginForm";
import { RegisterFormValues } from "../../forms/RegisterForm";
import { User } from "../../types";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props): JSX.Element => {
  const tokenKey = "token";
  const storageKey = "appState";

  const [state, dispatch] = useReducer(
    reducer,
    initialAuthState,
    (initial) =>
      (JSON.parse(localStorage.getItem(storageKey) as string) as AuthState) ||
      initial
  );

  const handleUserResponse = (response: AxiosResponse): Promise<boolean> => {
    const { data: user } = response;
    Cookies.set(tokenKey, response.headers.authorization, { expires: 1 });
    const state: AuthState = {
      isAuthenticated: true,
      user,
    };

    localStorage.setItem(storageKey, JSON.stringify(state));
    dispatch({ type: "LOGIN_COMPLETE", user });
    return Promise.resolve(true);
  };

  const handleError = (): Promise<boolean> => {
    dispatch({ type: "ERROR", error: "Invalid email or password." });
    return Promise.resolve(false);
  };

  const register = async (values: RegisterFormValues): Promise<boolean> => {
    dispatch({ type: "LOGIN_STARTED" });

    return axios
      .post("/signup", {
        user: { ...values },
      })
      .then(handleUserResponse)
      .catch(handleError);
  };

  const login = async (
    values: LoginFormValues,
    domain = "client"
  ): Promise<boolean> => {
    dispatch({ type: "LOGIN_STARTED" });

    return axios
      .post("/login", {
        user: { ...values, ...{ domain: domain } },
      })
      .then(handleUserResponse)
      .catch(handleError);
  };

  const logout = useCallback(async (): Promise<void> => {
    axios
      .delete("/logout")
      .then(() => {
        Cookies.remove(tokenKey);
        localStorage.removeItem(storageKey);
        dispatch({ type: "LOGOUT" });
      })
      .catch(handleError);
  }, []);

  const updateUser = useCallback(async (user: User): Promise<void> => {
    dispatch({ type: "USER_UPDATED", user: user });
  }, []);

  const { isAuthenticated } = state;
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      (async () => {
        if (!Cookies.get(tokenKey) && isAuthenticated) {
          await logout();
        }
      })();
    }
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, tokenKey, logout]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
