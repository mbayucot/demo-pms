import React from "react";
import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import logo from "../../assets/images/logo.svg";
import { HeaderNav } from "./style";

const Header = (): React.ReactElement => {
  return (
    <HeaderNav>
      <Navbar expand="lg">
        <div className="container-fluid">
          <h5 className="my-0 font-weight-normal">
            <NavLink to="/">
              <img src={logo} alt="Demo logo" height="40" />
            </NavLink>
          </h5>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto" as="ul">
              <Nav.Item as="li">
                <NavLink to="/pricing">Pricing</NavLink>
              </Nav.Item>
              <Nav.Item as="li">
                <NavLink to="/signup">Blog</NavLink>
              </Nav.Item>
            </Nav>
            <Nav as="ul">
              <Nav.Item as="li">
                <NavLink to="/contact">Contact Us</NavLink>
              </Nav.Item>
              <Nav.Item as="li">
                <NavLink to="/login">Log in</NavLink>
              </Nav.Item>
              <Nav.Item as="li">
                <NavLink to="/signup" className="btn btn-primary">
                  Sign up
                </NavLink>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </HeaderNav>
  );
};

export default Header;
