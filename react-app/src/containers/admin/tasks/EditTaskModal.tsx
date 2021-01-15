import React, { FC } from "react";
import { withFormik } from "formik";
import useSWR from "swr";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import TaskForm, {
  TaskFormValues,
  validationSchema,
} from "../../../forms/TaskForm";
import axios from "../../../lib/axios";
import { FormWithModalProps } from "../../../lib/modal-manager";
import { User } from "../../../types";

interface TaskFormProps {
  assignee?: User;
  isAdmin?: boolean;
}

const EditTaskModal: FC<FormWithModalProps> = ({ id, onHide }) => {
  const { data } = useSWR(`admin/tasks/${id}`);

  const EnhancedTaskForm = withFormik<
    TaskFormProps & TaskFormValues,
    TaskFormValues
  >({
    mapPropsToValues: (props) => {
      return {
        summary: props.summary || "",
        description: props.description || "",
        status: props.status || "",
        assigned_to: props.assignee ? props.assignee.id : "",
      };
    },

    validationSchema: validationSchema,

    handleSubmit: async (values: TaskFormValues, { props, ...actions }) => {
      try {
        await axios.patch(`admin/tasks/${id}`, values);
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
          <h6>Edit Task</h6>
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
        <EnhancedTaskForm {...data} isAdmin />
      </fieldset>
    </Modal>
  );
};

export default EditTaskModal;
