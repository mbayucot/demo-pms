import React, { FC } from "react";
import { NavLink } from "react-router-dom";

const UnAuthorizedPage: FC = () => {
  return (
    <div className="fp-center">
      <h1>Authorization Required!</h1>
      <p>Sorry, your request cannot be processed.</p>
      <NavLink to="/" className="btn btn-outline-primary">
        Back to Home
      </NavLink>
    </div>
  );
};

export default UnAuthorizedPage;
