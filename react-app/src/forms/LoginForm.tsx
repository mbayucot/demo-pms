import { FormikProps } from "formik";
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NavLink } from "react-router-dom";

export type FormValues = {
  email: string;
  password: string;
};

const LoginForm = (props: FormikProps<FormValues>): React.ReactElement => {
  const {
    values,
    handleChange,
    errors,
    isValidating,
    isSubmitting,
    handleSubmit,
  } = props;
  return (
    <Form noValidate onSubmit={handleSubmit} className="theme-form">
      <h4 className="mb-4">Sign in to account</h4>
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
          disabled={!isValidating && isSubmitting}
        >
          {isSubmitting ? "Signing in.." : "Sign In"}
        </Button>
      </div>
      <p className="mt-4 mb-0">
        Don't have account?
        <NavLink to="/signup" className="ml-2">
          Create Account
        </NavLink>
      </p>
    </Form>
  );
};

export default LoginForm;
