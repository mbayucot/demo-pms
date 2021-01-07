import React, { FC } from "react";
import Modal from "react-bootstrap/Modal";
import { withFormik } from "formik";
import useSWR from "swr";
import Spinner from "react-bootstrap/Spinner";

import axios from "../../../lib/axios";
import UserForm, {
  UserFormValues,
  validationSchema,
} from "../../../forms/UserForm";
import { FormWithModalProps } from "../../../types";

const EditUserModal: FC<FormWithModalProps> = ({ id, onHide }) => {
  const { data } = useSWR([`admin/users/${id}`]);

  const EnhancedUserForm = withFormik<UserFormValues, UserFormValues>({
    mapPropsToValues: (props) => ({
      email: props.email || "",
      password: props.password || "",
      first_name: props.first_name || "",
      last_name: props.last_name || "",
      role: props.role || "",
    }),

    validationSchema: validationSchema,

    handleSubmit: async (values: UserFormValues, { props, ...actions }) => {
      try {
        await axios.patch(`admin/users/${id}`, values);
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
          <h6>Edit User</h6>
          {!data && (
            <Spinner
              size="sm"
              animation="border"
              role="status"
              className="ml-3"
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
        </div>
      </Modal.Header>

      <fieldset disabled={!data}>
        <EnhancedUserForm {...data} />
      </fieldset>
    </Modal>
  );
};

export default EditUserModal;
