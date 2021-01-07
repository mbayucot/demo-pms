import { FormikProps } from "formik";
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import Spinner from "react-bootstrap/Spinner";

import { User } from "../types";

export type ProfileFormValues = Pick<
  User,
  "email" | "first_name" | "last_name"
>;

export const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  first_name: Yup.string()
    .required("First name is required")
    .min(2, "First name is too short")
    .max(50, "First name is too long"),
  last_name: Yup.string()
    .required("Last name is required")
    .min(2, "Last name is too short")
    .max(50, "Last name is too long"),
});

const ProfileForm = (
  props: FormikProps<ProfileFormValues>
): React.ReactElement => {
  const { values, handleChange, errors, isSubmitting, handleSubmit } = props;

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <h4 className="mb-4">Account</h4>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
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
      <Form.Group controlId="first_name">
        <Form.Label>First Name</Form.Label>
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
        <Form.Label>Last Name</Form.Label>
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
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="success"
          size="sm"
        >
          Update profile
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
      </div>
    </Form>
  );
};

export default ProfileForm;
