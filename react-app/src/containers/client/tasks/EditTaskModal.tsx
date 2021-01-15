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

const EditTaskModal: FC<FormWithModalProps> = ({ id, onHide }) => {
  const { data } = useSWR(`tasks/${id}`);

  const EnhancedTaskForm = withFormik<TaskFormValues, TaskFormValues>({
    mapPropsToValues: (props) => ({
      summary: props.summary || "",
      description: props.description || "",
      status: props.status || "",
      assigned_to: props.assigned_to || "",
    }),

    validationSchema: validationSchema,

    handleSubmit: async (values: TaskFormValues, { props, ...actions }) => {
      try {
        await axios.patch(`tasks/${id}`, values);
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
        <EnhancedTaskForm {...data} />
      </fieldset>
    </Modal>
  );
};

export default EditTaskModal;
