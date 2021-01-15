import React from "react";
import { NavLink } from "react-router-dom";
import { FormikProps } from "formik";
import * as Yup from "yup";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import { useAuth } from "../contexts/auth";
import { User } from "../types";

export type RegisterFormValues = Pick<User, "email" | "password">;

export const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .min(8, "Password is too short")
    .max(20, "Password is too long")
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must contain 8 characters, one uppercase, one\n" +
        "                lowercase, one Number and one special case character"
    ),
});

const RegisterForm = (
  props: FormikProps<RegisterFormValues>
): React.ReactElement => {
  const { error } = useAuth();
  const { values, handleChange, errors, isSubmitting, handleSubmit } = props;

  return (
    <Form noValidate onSubmit={handleSubmit} className="theme-form">
      <h4 className="mb-4">{"Create your account"}</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="email">
        <Form.Label>Email Address</Form.Label>
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
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="text-center">
        <Button
          type="submit"
          className="btn-blue mt-4 btn-block"
          disabled={isSubmitting}
        >
          Create Account
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
      </div>
      <p className="mt-4 mb-0">
        Already have an account?
        <NavLink to="/login" className="ml-2">
          Sign in
        </NavLink>
      </p>
    </Form>
  );
};

export default RegisterForm;
