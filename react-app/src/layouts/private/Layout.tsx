import React, { FC } from "react";
import Container from "react-bootstrap/Container";

import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <Container className="pt-5">{children}</Container>
    </>
  );
};

export default Layout;
