import React, { FC, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { withFormik } from "formik";

import LoginForm, {
  LoginFormValues,
  validationSchema,
} from "../forms/LoginForm";
import { withAuth, WithAuthProps } from "../contexts/auth";
import { LocationType } from "../types";

interface OtherProps {
  isAdmin: boolean;
}

const AdminLoginPage: FC = () => {
  const history = useHistory();
  const location = useLocation<LocationType>();
  const { from } = location.state || { from: { pathname: "/admin/projects" } };
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const EnhancedLoginForm = withAuth(
    withFormik<OtherProps & WithAuthProps, LoginFormValues>({
      mapPropsToValues: () => ({
        email: values.email || "",
        password: values.password || "",
      }),

      validationSchema: validationSchema,

      handleSubmit: async (values: LoginFormValues, { props, ...actions }) => {
        setValues(values);
        const isAuthenticated = await props.auth.login(values, "admin");
        if (isAuthenticated) {
          history.replace(from);
        }
      },
    })(LoginForm)
  );

  return <EnhancedLoginForm isAdmin />;
};

export default AdminLoginPage;
