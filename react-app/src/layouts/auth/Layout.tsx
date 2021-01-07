import React, { FC } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";

import { Wrapper } from "./style";
import logo from "../../assets/images/logo.svg";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Wrapper>
      <Container fluid={true} className="p-0">
        <Row className="m-0">
          <Col xs="12" className="p-0">
            <div className="login-card">
              <div>
                <div>
                  <NavLink to="/" className="logo">
                    <img
                      className="img-fluid for-light"
                      src={logo}
                      alt="logo"
                    />
                  </NavLink>
                </div>
                <div className="login-main">{children}</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default Layout;
