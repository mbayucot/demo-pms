import React, { FC, Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import Helmet from "react-helmet";
import Spinner from "react-bootstrap/Spinner";

import { PrivateRoute, AuthRoute, PublicRoute } from "./Routes";

const LandingPage = lazy(() => import("../pages/landing/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ProjectsPage = lazy(() => import("../containers/ProjectsPage"));
const NoMatchPage = lazy(() => import("../pages/NoMatchPage"));

const AppRoutes: FC = () => {
  return (
    <Suspense
      fallback={
        <div className="fp-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      }
    >
      <Switch>
        <PublicRoute exact path="/" title="Home">
          <LandingPage />
        </PublicRoute>
        <AuthRoute path="/login" title="Login">
          <LoginPage />
        </AuthRoute>
        <AuthRoute path="/signup" title="Register">
          <RegisterPage />
        </AuthRoute>
        <PrivateRoute exact path="/projects" title="Projects">
          <ProjectsPage />
        </PrivateRoute>
        <Route path="*">
          <Helmet title="Not Found" />
          <NoMatchPage />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
