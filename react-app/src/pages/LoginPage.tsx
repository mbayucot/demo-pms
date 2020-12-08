import React, { FC } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { withFormik } from "formik";
import * as Yup from "yup";

import LoginForm, { FormValues } from "../forms/LoginForm";
import withAuth, { WithAuthProps } from "../contexts/auth/withAuth";

type stateType = {
  from: { pathname: string };
};

const LoginPage: FC = () => {
  const history = useHistory();
  const location = useLocation<stateType>();
  const { from } = location.state || { from: { pathname: "/projects" } };

  const EnhancedLoginForm = withAuth(
    withFormik<WithAuthProps, FormValues>({
      mapPropsToValues: () => ({ email: "", password: "" }),

      validationSchema: Yup.object().shape({
        email: Yup.string()
          .email("Email is not valid")
          .required("Email is required"),
        password: Yup.string()
          .min(4, "Password is Too Short")
          .max(20, "Password is Too Long")
          .required("Password is required"),
      }),

      handleSubmit: async (values: FormValues, { props, ...actions }) => {
        const { auth } = props;
        try {
          await auth.login(values);
          actions.setSubmitting(false);

          // Redirect
          history.replace(from);
        } catch (error) {
          actions.setSubmitting(false);
          actions.setErrors({ email: error.message });
        }
      },
    })(LoginForm)
  );

  return <EnhancedLoginForm />;
};

export default LoginPage;
