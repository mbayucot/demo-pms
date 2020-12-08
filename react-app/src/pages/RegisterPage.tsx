import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { withFormik } from "formik";

import RegisterForm, { FormValues } from "../forms/RegisterForm";
import withAuth, { WithAuthProps } from "../contexts/auth/withAuth";

const RegisterPage: FC = () => {
  const history = useHistory();

  const EnhancedRegisterForm = withAuth(
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
          await auth.register(values);
          actions.setSubmitting(false);

          // Redirect
          history.replace({ pathname: "/projects" });
        } catch (error) {
          actions.setSubmitting(false);
          actions.setErrors({ email: error.message });
        }
      },
    })(RegisterForm)
  );

  return <EnhancedRegisterForm />;
};

export default RegisterPage;
