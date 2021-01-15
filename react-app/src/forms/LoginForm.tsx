import React from "react";
import { FormikProps } from "formik";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import { useAuth } from "../contexts/auth";
import { User } from "../types";

export type LoginFormValues = Pick<User, "email" | "password">;

interface OtherProps {
  isAdmin?: boolean;
}

export const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .min(8, "Password is too short")
    .max(20, "Password is too long")
    .required("Password is required"),
});

const LoginForm = (
  props: OtherProps & FormikProps<LoginFormValues>
): React.ReactElement => {
  const { error } = useAuth();
  const {
    values,
    handleChange,
    errors,
    isSubmitting,
    handleSubmit,
    isAdmin,
  } = props;

  return (
    <Form noValidate onSubmit={handleSubmit} className="theme-form">
      <h4 className="mb-4">Sign in to account</h4>
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
        <div className="d-flex justify-content-between">
          <Form.Label>Password</Form.Label>
          <NavLink to="/password_reset" className="nav-link d-inline-block">
            Forgot password?
          </NavLink>
        </div>
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
      <div className="text-center mt-4">
        <Button
          type="submit"
          className="btn-blue btn-block"
          disabled={isSubmitting}
        >
          Sign In
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
      {!isAdmin && (
        <p className="mt-4 mb-0">
          Don't have account?
          <NavLink to="/signup" className="ml-2">
            Create Account
          </NavLink>
        </p>
      )}
    </Form>
  );
};

export default LoginForm;
