import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";

const NoMatchPage: FC = () => {
  return (
    <div className="fp-center">
      <h1>Oops! That page can’t be found.</h1>
      <p>It looks like nothing was found at this location.</p>
      <NavLink to="/">
        <Button>Back to Home</Button>
      </NavLink>
    </div>
  );
};

export default NoMatchPage;
