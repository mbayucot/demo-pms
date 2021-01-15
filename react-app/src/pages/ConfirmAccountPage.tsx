import React, { FC } from "react";
import { NavLink, useParams } from "react-router-dom";
import useSWR from "swr";
import Spinner from "react-bootstrap/Spinner";

const ConfirmAccountPage: FC = () => {
  const { token } = useParams<{
    token: string;
  }>();
  const { data } = useSWR([`confirmation?confirmation_token=${token}`]);

  if (!data) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <p>
      Your email address has been successfully confirmed.
      <NavLink to="/">Return to sign in</NavLink>
    </p>
  );
};

export default ConfirmAccountPage;
