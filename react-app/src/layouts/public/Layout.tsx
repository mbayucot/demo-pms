import React, { FC } from "react";
import Container from "react-bootstrap/Container";

import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: React.ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <Container fluid>{children}</Container>
      <Footer />
    </>
  );
};

export default Layout;
