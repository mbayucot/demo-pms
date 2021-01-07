import React, { FC } from "react";
import Modal from "react-bootstrap/Modal";
import { withFormik } from "formik";

import TaskForm, {
  TaskFormValues,
  validationSchema,
} from "../../../forms/TaskForm";
import axios from "../../../lib/axios";
import { FormWithModalProps } from "../../../types";

interface NewTaskModalProps extends FormWithModalProps {
  projectId: string | number | undefined;
}

const NewTaskModal: FC<NewTaskModalProps> = ({ projectId, onHide }) => {
  const EnhancedProjectForm = withFormik<
    Record<string, unknown>,
    TaskFormValues
  >({
    validationSchema: validationSchema,

    handleSubmit: async (values: TaskFormValues, { props, ...actions }) => {
      try {
        await axios.post(`projects/${projectId}/tasks`, values);
        onHide(true);
      } catch (error) {
        actions.setErrors(error.response.data);
      }
    },
  })(TaskForm);

  return (
    <Modal show={true} animation={false} onHide={onHide} centered>
      <Modal.Header closeButton>
        <div className="modal-title">
          <h6>New Task</h6>
        </div>
      </Modal.Header>
      <EnhancedProjectForm />
    </Modal>
  );
};

export default NewTaskModal;
