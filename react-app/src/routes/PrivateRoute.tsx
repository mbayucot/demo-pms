import React, { useContext } from "react";
import { useAuth } from "../contexts/auth";
import { Redirect, Route, RouteProps } from "react-router-dom";
import Helmet from "react-helmet";

import Layout from "../layouts/private/Layout";

import { AbilityContext } from "../config/can";
import { Subjects } from "../config/can/ability";

interface PrivateRouteProps extends RouteProps {
  title: string;
  subject?: string;
}

const PrivateRoute = ({
  children,
  title,
  subject,
  ...rest
}: PrivateRouteProps): React.ReactElement => {
  const { isAuthenticated } = useAuth();
  const ability = useContext(AbilityContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          [
            !subject || ability.can("read", subject as Subjects) ? (
              <React.Fragment key={subject}>
                <Helmet title={title} />
                <Layout>{children}</Layout>
              </React.Fragment>
            ) : (
              <Redirect
                to={{
                  pathname: "/unauthorized",
                  state: { from: location },
                }}
              />
            ),
          ]
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

export default PrivateRoute;
