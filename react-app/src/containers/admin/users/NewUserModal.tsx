import React, { FC } from "react";
import { withFormik } from "formik";
import Modal from "react-bootstrap/Modal";

import UserForm, {
  UserFormValues,
  validationSchema,
} from "../../../forms/UserForm";
import axios from "../../../lib/axios";
import { FormWithModalProps } from "../../../lib/modal-manager";
import * as Yup from "yup";

const NewUserModal: FC<FormWithModalProps> = ({ onHide }) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const EnhancedUserForm = withFormik<object, UserFormValues>({
    mapPropsToValues: () => ({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "",
    }),

    validationSchema: Yup.object().shape({
      ...validationSchema.fields,
      password: Yup.string().required("Password is required"),
    }),

    handleSubmit: async (values: UserFormValues, { props, ...actions }) => {
      try {
        await axios.post("admin/users", values);
        onHide(true);
      } catch (error) {
        actions.setErrors(error.response.data);
      }
    },
  })(UserForm);

  return (
    <Modal show={true} animation={false} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <div className="modal-title">
          <h6>New User</h6>
        </div>
      </Modal.Header>
      <EnhancedUserForm />
    </Modal>
  );
};

export default NewUserModal;
