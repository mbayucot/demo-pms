import React, { FC } from "react";
import { FallbackProps } from "react-error-boundary";
import Helmet from "react-helmet";
import Button from "react-bootstrap/Button";

const ErrorFallback: FC<FallbackProps> = ({ resetErrorBoundary }) => {
  return (
    <>
      <Helmet title="Error" />
      <div className="fp-center">
        <h1>Something went wrong</h1>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </>
  );
};

export default ErrorFallback;
