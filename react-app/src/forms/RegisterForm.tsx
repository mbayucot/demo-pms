import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormikProps } from "formik";
import { NavLink } from "react-router-dom";

export type FormValues = {
  email: string;
  password: string;
};

const RegisterForm = (props: FormikProps<FormValues>): React.ReactElement => {
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
      <h4 className="mb-4">{"Create your account"}</h4>
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
          disabled={!isValidating && isSubmitting}
        >
          {isSubmitting ? "Creating account.." : "Create Account"}
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
