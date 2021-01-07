import React, { FC } from "react";
import Modal from "react-bootstrap/Modal";
import { withFormik } from "formik";

import UserForm, {
  UserFormValues,
  validationSchema,
} from "../../../forms/UserForm";
import axios from "../../../lib/axios";
import { FormWithModalProps } from "../../../types";

const NewUserModal: FC<FormWithModalProps> = ({ onHide }) => {
  const EnhancedUserForm = withFormik<Record<string, unknown>, UserFormValues>({
    validationSchema: validationSchema,

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
