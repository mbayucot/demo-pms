import React from "react";
import { Route, RouteProps } from "react-router-dom";
import Helmet from "react-helmet";
import Layout from "../layouts/public/Layout";

interface RouterProps extends RouteProps {
  title: string;
}

const PublicRoute = ({
  children,
  title,
  ...rest
}: RouterProps): React.ReactElement => {
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

export default PublicRoute;
