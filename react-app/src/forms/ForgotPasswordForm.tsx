import React from "react";
import Form from "react-bootstrap/Form";
import { FormikProps } from "formik";
import Button from "react-bootstrap/Button";
import * as Yup from "yup";
import Spinner from "react-bootstrap/Spinner";

import { User } from "../types";

export type ForgotPasswordFormValues = Pick<User, "email">;

export const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("Email is required"),
});

const ForgotPasswordForm = (props: FormikProps<ForgotPasswordFormValues>) => {
  const { values, handleChange, errors, isSubmitting, handleSubmit } = props;

  return (
    <Form noValidate onSubmit={handleSubmit} className="theme-form">
      <h4>Reset your password</h4>
      <p>
        Enter your user account's verified email address and we will send you a
        password reset link.
      </p>
      <Form.Group controlId="email">
        <Form.Control
          type="text"
          name="email"
          autoFocus
          placeholder={"Enter your email address"}
          value={values.email}
          onChange={handleChange}
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="text-center">
        <Button
          type="submit"
          size="lg"
          className="btn-blue mt-4 btn-block"
          disabled={isSubmitting}
        >
          Send password reset email
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

export default ForgotPasswordForm;
