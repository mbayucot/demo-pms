import React, { FC, useState } from "react";
import { withFormik } from "formik";
import useSWR from "swr";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import axios from "../../lib/axios";
import ProfileForm, {
  ProfileFormValues,
  validationSchema,
} from "../../forms/ProfileForm";
import ProfilePictureTab from "./ProfilePictureTab";

const ProfilePage: FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { data, mutate } = useSWR([`users/show`]);

  const handleChange = async () => {
    await mutate();
  };

  const EnhancedProfileForm = withFormik<ProfileFormValues, ProfileFormValues>({
    mapPropsToValues: (props) => ({
      email: props.email || "",
      first_name: props.first_name || "",
      last_name: props.last_name || "",
    }),

    validationSchema: validationSchema,

    handleSubmit: async (values: ProfileFormValues, { props, ...actions }) => {
      try {
        await axios.patch(`users/update`, values);
        setShowAlert(true);
      } catch (error) {
        actions.setErrors(error.response.data);
      }
    },
  })(ProfileForm);

  return (
    <>
      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          Your profile has been successfully updated.
        </Alert>
      )}

      <h4>Profile</h4>

      <fieldset disabled={!data} className="mt-4">
        <Row>
          <Col>
            {!data && (
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            <EnhancedProfileForm {...data} />
          </Col>
          <Col>
            <ProfilePictureTab avatar={data?.avatar} onChange={handleChange} />
          </Col>
        </Row>
      </fieldset>
    </>
  );
};

export default ProfilePage;
