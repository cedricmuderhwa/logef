import React, { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import FullPageLoader from "../components/FullPageLoader/FullPageLoader";
import { PrivateRoute } from "../utils/withProtect";
import ForgotPwdPage from "./ForgotPwd";
const LoginPage = React.lazy(() => import("./Auth"));
const Error = React.lazy(() => import("./Error"));
const LandingPage = React.lazy(() => import("./LandingPage"));
const MainPage = React.lazy(() => import("./MainPage"));

function App() {
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  });

  return (
    <ErrorBoundary>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPwdPage />} />
          <Route
            path="auth/*"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Error error_type={404} />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
