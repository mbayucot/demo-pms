import React, { FC } from "react";
import { useHistory, NavLink } from "react-router-dom";
import Avatar from "@atlaskit/avatar";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { useAuth } from "../../contexts/auth";
import { Can } from "../../config/can";

const Header: FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const { logout } = useAuth();
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">Demo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Can I="read" a="Project">
              <NavLink
                to="/projects"
                activeClassName="active"
                className="nav-link"
              >
                Projects
              </NavLink>
            </Can>
            <Can I="read" a="AdminProject">
              <NavLink
                to="/admin/projects"
                activeClassName="active"
                className="nav-link"
              >
                Projects
              </NavLink>
            </Can>
            <Can I="read" a="User">
              <NavLink
                to="/admin/users"
                activeClassName="active"
                className="nav-link"
              >
                Users
              </NavLink>
            </Can>
          </Nav>

          <Nav>
            <DropdownButton
              menuAlign="right"
              title={<Avatar size="small" src={user?.avatar} />}
              id="account-dropdown"
              variant="dark"
              className="bg-dark border-0 text-white"
            >
              <Dropdown.Item
                as={"button"}
                onClick={() => {
                  history.push("/profile");
                }}
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                as={"button"}
                onClick={() => {
                  history.push("/settings");
                }}
              >
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                as={"button"}
                onClick={() => {
                  logout().then(() => history.push("/"));
                }}
              >
                Sign Out
              </Dropdown.Item>
            </DropdownButton>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
