import { FormikProps } from "formik";
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import * as Yup from "yup";
import AsyncSelect from "react-select/async";

import { searchUsersByRole } from "../api/user";
import { Project, User } from "../types/models";

export type ProjectFormValues = Pick<Project, "name" | "created_by">;

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name is too short")
    .max(20, "Name is too long"),
});

interface OtherProps {
  isAdmin?: boolean;
  client?: User;
}

const ProjectForm = (
  props: OtherProps & FormikProps<ProjectFormValues>
): React.ReactElement => {
  const {
    values,
    handleChange,
    errors,
    isSubmitting,
    handleSubmit,
    setFieldValue,
    isAdmin,
    client,
  } = props;
  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Modal.Body>
        <Form.Group controlId="name">
          <Form.Label className="font-weight-medium">Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={values.name}
            autoFocus
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>
        {isAdmin && (
          <Form.Group controlId="client">
            <Form.Label className="font-weight-medium">Client</Form.Label>
            <AsyncSelect
              inputId="client"
              name="client"
              closeMenuOnSelect={true}
              isClearable={true}
              cacheOptions
              defaultOptions
              className={errors.created_by ? "is-invalid" : ""}
              loadOptions={(inputValue: string) =>
                searchUsersByRole({
                  query: inputValue,
                  role: "client",
                })
              }
              defaultValue={
                client ? { value: client.id, label: client.full_name } : {}
              }
              onChange={(value) => {
                setFieldValue("created_by", value ? value.value : "");
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.created_by}
            </Form.Control.Feedback>
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="success"
          size="sm"
        >
          Save
          {isSubmitting && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="ml-2"
            />
          )}
        </Button>
      </Modal.Footer>
    </Form>
  );
};

export default ProjectForm;
