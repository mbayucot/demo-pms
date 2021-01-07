import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";

const UnAuthorizedPage: FC = () => {
  return (
    <div className="fp-center">
      <h1>Authorization Required!</h1>
      <p>Sorry, your request cannot be processed.</p>
      <NavLink to="/">
        <Button>Back to Home</Button>
      </NavLink>
    </div>
  );
};

export default UnAuthorizedPage;
