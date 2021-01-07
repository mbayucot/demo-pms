import React, { FC, Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import Helmet from "react-helmet";
import Spinner from "react-bootstrap/Spinner";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AuthRoute from "./AuthRoute";
import { AbilityContext, defineAbilityFor } from "../config/can";
import { useAuth } from "../contexts/auth";
const LandingPage = lazy(() => import("../pages/landing/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const ConfirmAccountPage = lazy(() => import("../pages/ConfirmAccountPage"));

const ProjectsPage = lazy(
  () => import("../containers/client/projects/ProjectsPage")
);
const TasksPage = lazy(() => import("../containers/client/tasks/TasksPage"));
const ProfilePage = lazy(() => import("../containers/account/ProfilePage"));
const SettingsPage = lazy(() => import("../containers/account/SettingsPage"));

const AdminLoginPage = lazy(() => import("../pages/AdminLoginPage"));
const AdminProjectsPage = lazy(
  () => import("../containers/admin/projects/ProjectsPage")
);
const AdminTasksPage = lazy(
  () => import("../containers/admin/tasks/TasksPage")
);
const AdminUsersPage = lazy(
  () => import("../containers/admin/users/UsersPage")
);

const NoMatchPage = lazy(() => import("../pages/NoMatchPage"));
const UnAuthorizedPage = lazy(() => import("../pages/UnAuthorizedPage"));

const AppRoutes: FC = () => {
  const { user } = useAuth();
  const ability = defineAbilityFor(user);

  return (
    <AbilityContext.Provider value={ability}>
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
          <AuthRoute path="/forgot_password" title="Forgot password">
            <ForgotPasswordPage />
          </AuthRoute>
          <AuthRoute path="/reset_password/:token" title="Reset password">
            <ResetPasswordPage />
          </AuthRoute>
          <AuthRoute path="/confirmation/:token" title="Confirm account">
            <ConfirmAccountPage />
          </AuthRoute>

          <PrivateRoute
            path="/projects/:projectId/tasks"
            title="Tasks"
            subject="Task"
          >
            <TasksPage />
          </PrivateRoute>

          <PrivateRoute path="/projects" title="Project" subject="Project">
            <ProjectsPage />
          </PrivateRoute>

          <PrivateRoute path="/profile" title="Profile">
            <ProfilePage />
          </PrivateRoute>
          <PrivateRoute path="/settings" title="Settings">
            <SettingsPage />
          </PrivateRoute>

          <AuthRoute path="/admin/login" title="Login">
            <AdminLoginPage />
          </AuthRoute>
          <PrivateRoute
            path="/admin/projects/:projectId/tasks"
            title="Tasks"
            subject="AdminTask"
          >
            <AdminTasksPage />
          </PrivateRoute>

          <PrivateRoute
            path="/admin/projects"
            title="Projects"
            subject="AdminProject"
          >
            <AdminProjectsPage />
          </PrivateRoute>

          <PrivateRoute path="/admin/users" title="Users" subject="User">
            <AdminUsersPage />
          </PrivateRoute>

          <Route path="/unauthorized">
            <Helmet title="Unauthorized" />
            <UnAuthorizedPage />
          </Route>
          <Route path="*">
            <Helmet title="Not Found" />
            <NoMatchPage />
          </Route>
        </Switch>
      </Suspense>
    </AbilityContext.Provider>
  );
};

export default AppRoutes;
