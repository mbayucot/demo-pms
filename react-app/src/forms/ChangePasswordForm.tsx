import { FormikProps } from "formik";
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import * as Yup from "yup";
import Spinner from "react-bootstrap/Spinner";

export type ChangePasswordFormValues = {
  new_password: string;
  confirm_password: string;
};

export const validationSchema = Yup.object().shape({
  new_password: Yup.string()
    .min(8, "New password is too short")
    .max(20, "New password is too long")
    .required("New password is required"),
  confirm_password: Yup.string()
    .min(8, "Confirm password is too short")
    .max(20, "Confirm password is too long")
    .required("Confirm password is required")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.new_password === value;
    }),
});

const ChangePasswordForm = (
  props: FormikProps<ChangePasswordFormValues>
): React.ReactElement => {
  const { values, handleChange, errors, isSubmitting, handleSubmit } = props;

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Row>
        <Col md={4}>
          <Form.Group controlId="new_password">
            <Form.Label className="font-weight-medium">New password</Form.Label>
            <Form.Control
              type="password"
              name="new_password"
              value={values.new_password}
              onChange={handleChange}
              isInvalid={!!errors.new_password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.new_password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="confirm_password">
            <Form.Label className="font-weight-medium">
              Confirm new password
            </Form.Label>
            <Form.Control
              type="password"
              name="confirm_password"
              value={values.confirm_password}
              autoFocus
              onChange={handleChange}
              isInvalid={!!errors.confirm_password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirm_password}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Form.Row>
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant={"success"}
          size="sm"
        >
          Update password
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

export default ChangePasswordForm;
