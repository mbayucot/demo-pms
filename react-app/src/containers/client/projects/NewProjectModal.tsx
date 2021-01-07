import React, { FC } from "react";
import Modal from "react-bootstrap/Modal";
import { withFormik } from "formik";

import ProjectForm, {
  ProjectFormValues,
  validationSchema,
} from "../../../forms/ProjectForm";
import axios from "../../../lib/axios";
import { FormWithModalProps } from "../../../types";

const NewProjectModal: FC<FormWithModalProps> = ({ onHide }) => {
  const EnhancedProjectForm = withFormik<
    Record<string, unknown>,
    ProjectFormValues
  >({
    validationSchema: validationSchema,

    handleSubmit: async (values: ProjectFormValues, { props, ...actions }) => {
      try {
        await axios.post("projects", values);
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
      <EnhancedProjectForm />
    </Modal>
  );
};

export default NewProjectModal;
