import React, { FC, useState } from "react";
import { withFormik } from "formik";
import { NavLink, useParams } from "react-router-dom";

import ResetPasswordForm, {
  ResetPasswordFormValues,
  validationSchema,
} from "../forms/ResetPasswordForm";
import { withAuth, WithAuthProps } from "../contexts/auth";
import axios from "../lib/axios";

const ResetPasswordPage: FC = () => {
  const { token } = useParams<{
    token: string;
  }>();
  const [showAlert, setShowAlert] = useState(false);

  const onSuccess = () => {
    setShowAlert(true);
  };

  const EnhancedChangePasswordForm = withAuth(
    withFormik<WithAuthProps, ResetPasswordFormValues>({
      validationSchema: validationSchema,

      handleSubmit: async (
        values: ResetPasswordFormValues,
        { props, ...actions }
      ) => {
        try {
          await axios.put("/password", {
            user: {
              ...values,
              ...{ token },
            },
          });
          onSuccess();
        } catch (error) {
          actions.setErrors(error.response.data);
        }
      },
    })(ResetPasswordForm)
  );

  return (
    <>
      {showAlert ? (
        <div>
          <p>Password changed successfully!</p>
          <NavLink to="/login">Return to sign in</NavLink>
        </div>
      ) : (
        <EnhancedChangePasswordForm />
      )}
    </>
  );
};

export default ResetPasswordPage;
