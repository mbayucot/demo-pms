import React, { FC } from "react";
import { NavLink } from "react-router-dom";

import { Styles } from "./style";

const LandingPage: FC = () => {
  return (
    <Styles>
      <div className="hero">
        <h1>Lorem ipsum dolor sit amet</h1>
        <div className="hero__body">
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi.
          </p>
        </div>
        <div className="hero__cta">
          <div className="hero__collection">
            <NavLink to="/signup" className="btn btn-primary">
              Get started
            </NavLink>
            <span>or</span>
            <NavLink to="/contact" className="btn btn-outline-secondary">
              Contact us
            </NavLink>
          </div>
        </div>
      </div>
    </Styles>
  );
};

export default LandingPage;
