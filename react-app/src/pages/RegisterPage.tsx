import React, { FC, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { withFormik } from "formik";

import RegisterForm, {
  RegisterFormValues,
  validationSchema,
} from "../forms/RegisterForm";
import { withAuth, WithAuthProps } from "../contexts/auth";

const RegisterPage: FC = () => {
  const history = useHistory();
  const location = useLocation<{
    from: { pathname: string };
  }>();
  const { from } = location.state || { from: { pathname: "/projects" } };
  const [values, setValues] = useState<RegisterFormValues>({
    email: "",
    password: "",
  });

  const EnhancedRegisterForm = withAuth(
    withFormik<WithAuthProps, RegisterFormValues>({
      mapPropsToValues: () => ({
        email: values.email || "",
        password: values.password || "",
      }),

      validationSchema: validationSchema,

      handleSubmit: async (values: RegisterFormValues, { props }) => {
        setValues(values);
        const isAuthenticated = await props.auth.register(values);
        if (isAuthenticated) {
          history.replace(from);
        }
      },
    })(RegisterForm)
  );

  return <EnhancedRegisterForm />;
};

export default RegisterPage;
