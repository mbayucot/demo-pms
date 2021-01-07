import React, { FC, useState } from "react";
import { withFormik } from "formik";
import useSWR from "swr";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import axios from "../../lib/axios";
import ProfileForm, {
  ProfileFormValues,
  validationSchema,
} from "../../forms/ProfileForm";
import ProfilePictureTab from "./ProfilePictureTab";

const ProfilePage: FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { data, mutate } = useSWR([`users/show`]);

  const onSuccess = () => {
    setShowAlert(true);
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
        await axios.post(`users`, values);
        onSuccess();
      } catch (error) {
        actions.setErrors(error.response.data);
      }
    },
  })(ProfileForm);

  return (
    <>
      {showAlert && <p>profile change successful</p>}

      <Row>
        <Col>
          {!data ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <EnhancedProfileForm {...data} />
          )}
        </Col>
        <Col>
          <ProfilePictureTab data={data} mutate={mutate} />
        </Col>
      </Row>
    </>
  );
};

export default ProfilePage;
