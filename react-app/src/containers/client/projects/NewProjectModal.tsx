import React, { FC } from "react";
import { withFormik } from "formik";
import Modal from "react-bootstrap/Modal";

import ProjectForm, {
  ProjectFormValues,
  validationSchema,
} from "../../../forms/ProjectForm";
import axios from "../../../lib/axios";
import { FormWithModalProps } from "../../../lib/modal-manager";

const NewProjectModal: FC<FormWithModalProps> = ({ onHide }) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const EnhancedProjectForm = withFormik<object, ProjectFormValues>({
    mapPropsToValues: (props) => ({ name: "" }),

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
