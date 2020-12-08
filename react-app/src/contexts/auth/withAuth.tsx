import React, { ComponentType } from "react";
import AuthContext, { AuthContextInterface } from "./AuthContext";

export interface WithAuthProps {
  auth: AuthContextInterface;
}

const withAuth = <P extends WithAuthProps>(
  Component: ComponentType<P>
): ComponentType<Omit<P, keyof WithAuthProps>> => (props): JSX.Element => (
  <AuthContext.Consumer>
    {(auth: AuthContextInterface): JSX.Element => (
      <Component {...(props as P)} auth={auth} />
    )}
  </AuthContext.Consumer>
);

export default withAuth;
