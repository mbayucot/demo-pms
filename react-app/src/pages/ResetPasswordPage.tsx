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

  const EnhancedChangePasswordForm = withAuth(
    withFormik<WithAuthProps, ResetPasswordFormValues>({
      mapPropsToValues: () => ({
        new_password: "",
        confirm_password: "",
      }),

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
          setShowAlert(true);
        } catch (error) {
          actions.setErrors(error.response.data);
        }
      },
    })(ResetPasswordForm)
  );

  if (showAlert) {
    return (
      <div>
        <p>Password changed successfully!</p>
        <NavLink to="/login">Return to sign in</NavLink>
      </div>
    );
  }

  return <EnhancedChangePasswordForm />;
};

export default ResetPasswordPage;
