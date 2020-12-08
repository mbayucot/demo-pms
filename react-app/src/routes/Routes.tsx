import { Redirect, Route, RouteProps } from "react-router-dom";
import React from "react";
import Helmet from "react-helmet";

import useAuth from "../contexts/auth/useAuth";
import { default as PrivateLayout } from "../layouts/private/Layout";
import { default as PublicLayout } from "../layouts/public/Layout";
import { default as AuthLayout } from "../layouts/auth/Layout";

interface Props extends RouteProps {
  title: string;
}

const PublicRoute = ({
  children,
  title,
  ...rest
}: Props): React.ReactElement => {
  return (
    <Route
      {...rest}
      render={() => (
        <>
          <Helmet title={title} />
          <PublicLayout>{children}</PublicLayout>
        </>
      )}
    />
  );
};

const PrivateRoute = ({
  children,
  title,
  ...rest
}: Props): React.ReactElement => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          <>
            <Helmet title={title} />
            <PrivateLayout>{children}</PrivateLayout>
          </>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const AuthRoute = ({ children, title, ...rest }: Props): React.ReactElement => {
  return (
    <Route
      {...rest}
      render={() => (
        <>
          <Helmet title={title} />
          <AuthLayout>{children}</AuthLayout>
        </>
      )}
    />
  );
};

export { PrivateRoute, PublicRoute, AuthRoute };
