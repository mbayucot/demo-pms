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

interface OtherProps {
  isAdmin: boolean;
}

const NewTaskModal: FC<NewTaskModalProps> = ({ projectId, onHide }) => {
  const EnhancedTaskForm = withFormik<OtherProps, TaskFormValues>({
    mapPropsToValues: (props) => {
      return {
        summary: "",
        description: "",
        status: "",
        assigned_to: "",
      };
    },

    validationSchema: validationSchema,

    handleSubmit: async (values: TaskFormValues, { props, ...actions }) => {
      try {
        await axios.post(`admin/projects/${projectId}/tasks`, values);
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
      <EnhancedTaskForm isAdmin />
    </Modal>
  );
};

export default NewTaskModal;
