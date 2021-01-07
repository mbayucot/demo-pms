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
    Record<string, unknown>,
    ForgotPasswordFormValues
  >({
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

  return (
    <>
      {showAlert ? (
        <div>
          <p>Forgot password successful. Please check your email.</p>
          <NavLink to="/login">Return to sign in</NavLink>
        </div>
      ) : (
        <EnhancedChangePasswordForm />
      )}
    </>
  );
};

export default ForgotPasswordPage;
