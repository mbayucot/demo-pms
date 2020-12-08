import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import Helmet from "react-helmet";

import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./contexts/auth/AuthProvider";
import ErrorFallbackPage from "./pages/ErrorFallbackPage";

/**
 * @returns React.ReactElement
 */
function App(): React.ReactElement {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallbackPage}
      onReset={() => {
        window.location.reload();
      }}
    >
      <Helmet titleTemplate="%s - Demo" defaultTitle="Demo">
        <meta name="description" content="A Demo application" />
      </Helmet>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
