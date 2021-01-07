import { FormikProps } from "formik";
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import Spinner from "react-bootstrap/Spinner";

export type ResetPasswordFormValues = {
  new_password: string;
  confirm_password: string;
};
export const validationSchema = Yup.object().shape({
  new_password: Yup.string()
    .required("New password is required")
    .min(8, "New password is too short")
    .max(20, "New password is too long"),
  confirm_password: Yup.string()
    .required("Confirm password is required")
    .min(8, "Confirm password is too short")
    .max(20, "Confirm password is too long")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});

const ResetPasswordForm = (
  props: FormikProps<ResetPasswordFormValues>
): React.ReactElement => {
  const {
    values,
    handleChange,
    errors,

    isSubmitting,
    handleSubmit,
  } = props;

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <h4>Reset your password</h4>
      <Form.Group controlId="new_password">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          name="new_password"
          value={values.new_password}
          autoFocus
          onChange={handleChange}
          isInvalid={!!errors.new_password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.new_password}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="confirm_password">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          name="confirm_password"
          value={values.confirm_password}
          onChange={handleChange}
          isInvalid={!!errors.confirm_password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirm_password}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="text-center mt-4">
        <Button
          type="submit"
          className="btn-blue btn-block"
          disabled={isSubmitting}
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
      </div>
    </Form>
  );
};

export default ResetPasswordForm;
