import React, { FC } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { useHistory, NavLink } from "react-router-dom";

import useAuth from "../../contexts/auth/useAuth";

const Header: FC = () => {
  const history = useHistory();
  const { logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">Demo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavLink to="/projects" activeClassName="active">
              Projects
            </NavLink>
          </Nav>
          <Nav>
            <Nav.Link
              as={"button"}
              className={"border-0 btn-light"}
              onClick={() => {
                logout().then(() => history.push("/"));
              }}
            >
              Sign Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
