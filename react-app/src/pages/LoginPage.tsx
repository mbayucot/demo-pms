import React, { FC, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { withFormik } from "formik";

import LoginForm, {
  LoginFormValues,
  validationSchema,
} from "../forms/LoginForm";
import { withAuth, WithAuthProps } from "../contexts/auth";

const LoginPage: FC = () => {
  const history = useHistory();
  const location = useLocation<{
    from: { pathname: string };
  }>();
  const { from } = location.state || { from: { pathname: "/projects" } };
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const EnhancedLoginForm = withAuth(
    withFormik<WithAuthProps, LoginFormValues>({
      mapPropsToValues: () => ({
        email: values.email || "",
        password: values.password || "",
      }),

      validationSchema: validationSchema,

      handleSubmit: async (values: LoginFormValues, { props, ...actions }) => {
        setValues(values);
        const isAuthenticated = await props.auth.login(values, "client");
        if (isAuthenticated) {
          history.replace(from);
        }
      },
    })(LoginForm)
  );

  return <EnhancedLoginForm />;
};

export default LoginPage;
