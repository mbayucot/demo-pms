import React, { FC } from "react";
import { NavLink } from "react-router-dom";

const NoMatchPage: FC = () => {
  return (
    <div className="fp-center">
      <h1>Oops! That page can’t be found.</h1>
      <p>It looks like nothing was found at this location.</p>
      <NavLink to="/" className="btn btn-outline-primary">
        Back to Home
      </NavLink>
    </div>
  );
};

export default NoMatchPage;
