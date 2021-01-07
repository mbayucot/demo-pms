import React, { FC } from "react";
import Modal from "react-bootstrap/Modal";
import { withFormik } from "formik";
import * as Yup from "yup";

import ProjectForm, {
  ProjectFormValues,
  validationSchema,
} from "../../../forms/ProjectForm";

import axios from "../../../lib/axios";
import { FormWithModalProps } from "../../../types";

interface OtherProps {
  isAdmin: boolean;
}

const NewProjectModal: FC<FormWithModalProps> = ({ onHide }) => {
  const EnhancedProjectForm = withFormik<OtherProps, ProjectFormValues>({
    validationSchema: Yup.object().shape({
      ...validationSchema.fields,
      created_by: Yup.string().required("Client is required"),
    }),

    handleSubmit: async (values: ProjectFormValues, { props, ...actions }) => {
      try {
        await axios.post("admin/projects", values);
        onHide(true);
      } catch (error) {
        actions.setErrors(error.response.data);
      }
    },
  })(ProjectForm);

  return (
    <Modal show={true} animation={false} onHide={onHide} centered>
      <Modal.Header closeButton>
        <div className="modal-title">
          <h6>New Project</h6>
        </div>
      </Modal.Header>
      <EnhancedProjectForm isAdmin />
    </Modal>
  );
};

export default NewProjectModal;
