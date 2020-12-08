import React, { useCallback, useEffect, useReducer } from "react";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

import AuthContext from "./AuthContext";
import { reducer } from "./reducer";
import { AuthState, initialAuthState, User } from "./state";

type Props = {
  children?: React.ReactNode;
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

  const handleUserResponse = useCallback((response: AxiosResponse) => {
    Cookies.set(tokenKey, response.headers.authorization, { expires: 1 });

    dispatch({ type: "LOGIN_COMPLETE", user: response.data });
  }, []);

  const handleError = useCallback((error) => {
    const msg = error.response.data.error;
    dispatch({ type: "ERROR", error: msg });

    throw new Error(msg);
  }, []);

  const register = useCallback(
    async (values: User): Promise<void> => {
      dispatch({ type: "LOGIN_STARTED" });

      return axios
        .post("/signup", { user: values })
        .then(handleUserResponse)
        .catch(handleError);
    },
    [handleUserResponse, handleError]
  );

  const login = useCallback(
    async (values: User): Promise<void> => {
      dispatch({ type: "LOGIN_STARTED" });

      return axios
        .post("/login", { user: values })
        .then(handleUserResponse)
        .catch(handleError);
    },
    [handleUserResponse, handleError]
  );

  const logout = async (): Promise<void> => {
    try {
      await axios.delete("/logout");

      Cookies.remove(tokenKey);
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      dispatch({ type: "ERROR", error: error.response.data.error });
    }
  };

  useEffect(() => {
    (async () => {
      const token = Cookies.get(tokenKey);

      if (!token && state.isAuthenticated) {
        dispatch({ type: "LOGOUT" });
      }

      localStorage.setItem(storageKey, JSON.stringify(state));
    })();
  }, [state]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
