import React, { FC } from "react";
import Container from "react-bootstrap/Container";

import Header from "./Header";
import AxiosHandler from "../../lib/axios/AxiosHandler";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Container className="mt-4">
        <AxiosHandler>{children}</AxiosHandler>
      </Container>
    </>
  );
};

export default Layout;
