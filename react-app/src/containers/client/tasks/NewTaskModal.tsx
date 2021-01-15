import React, { FC } from "react";
import { withFormik } from "formik";
import Modal from "react-bootstrap/Modal";

import TaskForm, {
  TaskFormValues,
  validationSchema,
} from "../../../forms/TaskForm";
import axios from "../../../lib/axios";
import { FormWithModalProps } from "../../../lib/modal-manager";

interface NewTaskModalProps extends FormWithModalProps {
  projectId: string | number | undefined;
}

type OtherProps = {
  isNew?: boolean;
};

const NewTaskModal: FC<NewTaskModalProps> = ({ projectId, onHide }) => {
  const EnhancedTaskForm = withFormik<OtherProps, TaskFormValues>({
    mapPropsToValues: (props) => ({
      summary: "",
      description: "",
      status: "",
      assigned_to: "",
    }),

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
    <Modal show={true} animation={false} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <div className="modal-title">
          <h6>New Task</h6>
        </div>
      </Modal.Header>
      <EnhancedTaskForm isNew />
    </Modal>
  );
};

export default NewTaskModal;
