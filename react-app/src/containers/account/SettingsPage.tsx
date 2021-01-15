import React, { FC, useState } from "react";
import { withFormik } from "formik";
import Alert from "react-bootstrap/Alert";

import ChangePasswordForm, {
  ChangePasswordFormValues,
  validationSchema,
} from "../../forms/ChangePasswordForm";
import axios from "../../lib/axios";

const SettingsPage: FC = () => {
  const [showAlert, setShowAlert] = useState(false);

  const EnhancedChangePasswordForm = withFormik<
    // eslint-disable-next-line @typescript-eslint/ban-types
    object,
    ChangePasswordFormValues
  >({
    mapPropsToValues: () => ({
      current_password: "",
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
        setShowAlert(true);
      } catch (error) {
        actions.setErrors(error.response.data);
      }
    },
  })(ChangePasswordForm);

  return (
    <>
      <h4 className="mb-4">Change password</h4>
      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          Your password has been successfully changed.
        </Alert>
      )}
      <EnhancedChangePasswordForm />
    </>
  );
};

export default SettingsPage;
