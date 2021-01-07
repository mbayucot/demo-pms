import React, { FC } from "react";
import Container from "react-bootstrap/Container";

import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Container fluid>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
