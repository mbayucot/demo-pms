import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import Helmet from "react-helmet";
import { SWRConfig } from "swr";
import qs from "qs";

import axios from "./lib/axios";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/auth";
import ErrorFallbackPage from "./pages/ErrorFallbackPage";
import * as Sentry from "@sentry/react";

/**
 *
 Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});
 */

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
        <SWRConfig
          value={{
            fetcher: (resource, params) =>
              axios
                .get(resource, {
                  params: params,
                  paramsSerializer: function (params) {
                    return qs.stringify(params, { arrayFormat: "brackets" });
                  },
                })
                .then((res) => res.data),
          }}
        >
          <AppRoutes />
        </SWRConfig>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
