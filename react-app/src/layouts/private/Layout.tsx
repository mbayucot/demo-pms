import React, { FC } from "react";
import Container from "react-bootstrap/Container";

import Header from "./Header";
import ErrorHandler from "../ErrorHandler";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Container className="mt-4">
        <ErrorHandler>{children}</ErrorHandler>
      </Container>
    </>
  );
};

export default Layout;
