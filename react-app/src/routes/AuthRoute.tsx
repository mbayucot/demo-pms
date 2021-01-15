import React from "react";
import { Route, RouteProps } from "react-router-dom";
import Helmet from "react-helmet";

import Layout from "../layouts/auth/Layout";

interface AuthRouteProps extends RouteProps {
  title: string;
}

const AuthRoute = ({
  children,
  title,
  ...rest
}: AuthRouteProps): React.ReactElement => {
  return (
    <Route
      {...rest}
      render={() => (
        <>
          <Helmet title={title} />
          <Layout>{children}</Layout>
        </>
      )}
    />
  );
};

export default AuthRoute;
