import React, { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import { withFormik } from "formik";

import ForgotPasswordForm, {
  ForgotPasswordFormValues,
  validationSchema,
} from "../forms/ForgotPasswordForm";
import axios from "../lib/axios";

const ForgotPasswordPage: FC = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const EnhancedChangePasswordForm = withFormik<
    // eslint-disable-next-line @typescript-eslint/ban-types
    object,
    ForgotPasswordFormValues
  >({
    mapPropsToValues: () => ({
      email: "",
    }),

    validationSchema: validationSchema,

    handleSubmit: async (
      values: ForgotPasswordFormValues,
      { props, ...actions }
    ) => {
      try {
        await axios.post("/password", {
          user: { ...values },
        });
        setShowAlert(true);
      } catch (error) {
        actions.setErrors(error.response.data);
      }
    },
  })(ForgotPasswordForm);

  if (showAlert) {
    return (
      <div>
        <p>
          Check your email for a link to reset your password. If it doesn’t
          appear within a few minutes, check your spam folder.
        </p>
        <NavLink to="/login">Return to sign in</NavLink>
      </div>
    );
  }

  return <EnhancedChangePasswordForm />;
};

export default ForgotPasswordPage;
