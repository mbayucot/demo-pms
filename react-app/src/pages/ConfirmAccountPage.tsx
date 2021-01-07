import React, { FC } from "react";
import { NavLink, useParams } from "react-router-dom";
import useSWR from "swr";
import Spinner from "react-bootstrap/Spinner";

const ConfirmAccountPage: FC = () => {
  const { token } = useParams<{
    token: string;
  }>();
  const { data } = useSWR([`confirmation?confirmation_token=${token}`]);

  return (
    <>
      {!data ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <p>
          Account confirmed. Please <NavLink to="/">Please login!</NavLink>
        </p>
      )}
    </>
  );
};

export default ConfirmAccountPage;
