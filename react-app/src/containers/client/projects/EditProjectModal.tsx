import React, { FC } from "react";
import { withFormik } from "formik";
import useSWR from "swr";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import ProjectForm, {
  ProjectFormValues,
  validationSchema,
} from "../../../forms/ProjectForm";

import axios from "../../../lib/axios";
import { FormWithModalProps } from "../../../lib/modal-manager";

const EditProjectModal: FC<FormWithModalProps> = ({ id, onHide }) => {
  const { data } = useSWR([`projects/${id}`]);

  const EnhancedProjectForm = withFormik<ProjectFormValues, ProjectFormValues>({
    mapPropsToValues: (props) => ({ name: props.name || "" }),

    validationSchema: validationSchema,

    handleSubmit: async (values: ProjectFormValues, { props, ...actions }) => {
      try {
        await axios.patch(`projects/${id}`, values);
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
          <h6>Edit Project</h6>
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
        <EnhancedProjectForm {...data} />
      </fieldset>
    </Modal>
  );
};

export default EditProjectModal;
