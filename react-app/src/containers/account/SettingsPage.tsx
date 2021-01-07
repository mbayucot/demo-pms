import React, { FC, useState } from "react";
import { withFormik } from "formik";
import ChangePasswordForm, {
  ChangePasswordFormValues,
  validationSchema,
} from "../../forms/ChangePasswordForm";
import axios from "../../lib/axios";

const SettingsPage: FC = () => {
  const [showAlert, setShowAlert] = useState(false);

  const onSuccess = () => {
    setShowAlert(true);
  };

  const EnhancedChangePasswordForm = withFormik<
    Record<string, unknown>,
    ChangePasswordFormValues
  >({
    mapPropsToValues: () => ({
      old_password: "",
      new_password: "",
      confirm_password: "",
    }),

    validationSchema: validationSchema,

    handleSubmit: async (
      values: ChangePasswordFormValues,
      { props, ...actions }
    ) => {
      try {
        await axios.post(`users/update_password`, values);
        onSuccess();
      } catch (error) {
        actions.setErrors(error.response.data);
      }
    },
  })(ChangePasswordForm);

  return (
    <>
      <h4 className="mb-4">Change password</h4>
      {showAlert && <p>password change successful</p>}
      <EnhancedChangePasswordForm />
    </>
  );
};

export default SettingsPage;
