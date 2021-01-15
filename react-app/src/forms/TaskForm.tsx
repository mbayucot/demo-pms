import React from "react";
import { FormikProps } from "formik";
import * as Yup from "yup";
import AsyncSelect from "react-select/async";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import { searchUsersByRole } from "../api/user";

import { Task, Status, User } from "../types";
import { enumKeys } from "../lib/utils";

export type TaskFormValues = Pick<
  Task,
  "summary" | "description" | "status" | "assigned_to"
>;

export const validationSchema = Yup.object().shape({
  summary: Yup.string()
    .required("Summary is required")
    .min(4, "Summary is too short")
    .max(32, "Summary is too long"),
  description: Yup.string()
    .required("Description is required")
    .min(4, "Description is too short")
    .max(32, "Description is too long"),
  status: Yup.string().required("Status is required"),
});

interface OtherProps {
  assignee?: User;
  isAdmin?: boolean;
  isNew?: boolean;
}

const TaskForm = (
  props: OtherProps & FormikProps<TaskFormValues>
): React.ReactElement => {
  const {
    values,
    handleChange,
    errors,
    isSubmitting,
    handleSubmit,
    setFieldValue,
    assignee,
    isAdmin,
    isNew,
  } = props;

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Modal.Body>
        <Form.Row>
          <Col>
            <Form.Group controlId="summary">
              <Form.Label className="font-weight-medium">Summary</Form.Label>
              <Form.Control
                type="text"
                name="summary"
                autoFocus
                value={values.summary}
                onChange={handleChange}
                isInvalid={!!errors.summary}
              />
              <Form.Control.Feedback type="invalid">
                {errors.summary}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label className="font-weight-medium">
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={values.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="status">
              <Form.Label className="font-weight-medium">Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={values.status}
                onChange={handleChange}
                isInvalid={!!errors.status}
              >
                <option value="" disabled>
                  {" "}
                </option>
                {enumKeys(Status).map((key) => {
                  return (
                    <option key={key} value={key}>
                      {Status[key]}
                    </option>
                  );
                })}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.status}
              </Form.Control.Feedback>
            </Form.Group>
            {!isNew && (
              <Form.Group controlId="assignee">
                <Form.Label className="font-weight-medium">Assignee</Form.Label>
                <AsyncSelect
                  name="assignee"
                  inputId="assignee"
                  isClearable={true}
                  cacheOptions
                  defaultOptions={isAdmin}
                  isDisabled={!isAdmin}
                  loadOptions={(inputValue: string) =>
                    searchUsersByRole(inputValue, "staff")
                  }
                  defaultValue={
                    assignee
                      ? { value: assignee.id, label: assignee.full_name }
                      : {}
                  }
                  onChange={(value) => {
                    setFieldValue("assigned_to", value ? value.value : "");
                  }}
                />
              </Form.Group>
            )}
          </Col>
        </Form.Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="sm"
          variant="success"
        >
          Save
          {isSubmitting && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
      </Modal.Footer>
    </Form>
  );
};

export default TaskForm;
