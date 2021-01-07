import { FormikProps } from "formik";
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import * as Yup from "yup";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";

import { User, Role } from "../types";
import { enumKeys } from "../lib/utils";

export type UserFormValues = Pick<
  User,
  "email" | "password" | "first_name" | "last_name" | "role"
>;

export const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  first_name: Yup.string()
    .required("First name is required")
    .min(2, "First name is too short")
    .max(20, "First name is too long"),
  last_name: Yup.string()
    .required("Last name is required")
    .min(2, "Last name is too short")
    .max(20, "Last name is too long"),
  role: Yup.string().required("Role is required"),
});

const UserForm = (props: FormikProps<UserFormValues>): React.ReactElement => {
  const { values, handleChange, errors, isSubmitting, handleSubmit } = props;

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Modal.Body>
        <Form.Row>
          <Col>
            <Form.Group controlId="email">
              <Form.Label className="font-weight-medium">Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={values.email}
                autoFocus
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label className="font-weight-medium">Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
              <Form.Text id="passwordHelpBlock" muted>
                Password must be 8-20 characters long, contain letters and
                numbers, and must not contain spaces, special characters, or
                emoji.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="role">
              <Form.Label className="font-weight-medium">Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={values.role}
                onChange={handleChange}
                isInvalid={!!errors.role}
              >
                <option value="" disabled>
                  {" "}
                </option>
                {enumKeys(Role).map((key) => {
                  return (
                    <option key={key} value={key}>
                      {Role[key]}
                    </option>
                  );
                })}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.role}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="first_name">
              <Form.Label className="font-weight-medium">First name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                isInvalid={!!errors.first_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.first_name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="last_name">
              <Form.Label className="font-weight-medium">Last name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                isInvalid={!!errors.last_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.last_name}
              </Form.Control.Feedback>
            </Form.Group>
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

export default UserForm;
