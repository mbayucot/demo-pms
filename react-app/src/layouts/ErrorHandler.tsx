import React, { FC, useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useHistory } from "react-router-dom";

import axios from "../lib/axios";

interface ErrorHandlerProps {
  children: React.ReactNode;
}

const ErrorHandler: FC<ErrorHandlerProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  axios.interceptors.response.use(undefined, function (error) {
    if (error.message === "Network Error" && !error.response) {
      setError(error.message);
    } else {
      switch (error.response.status) {
        case 404:
          history.push("/404");
          break;
        case 403:
          history.push("/unauthorized");
          break;
        case 500:
          setError("Internal Server Error");
          break;
        case 503:
          setError("Service Unavailable");
          break;
        default:
          setTimeout(() => {
            setError(null);
          }, 5000);
          break;
      }
    }

    return Promise.reject(error);
  });

  return (
    <>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {children}
    </>
  );
};

export default ErrorHandler;
