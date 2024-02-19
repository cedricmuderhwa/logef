import { showNotification } from "@mantine/notifications";
import React, { Suspense, useEffect, useState } from "react";
import { BsServer } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import ErrorBoundary from "../../components/ErrorBoundary";
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";
import BottomNavigation from "../../layouts/BottomNavigation";
import { addFraud } from "../../redux/slices/fraud_cases";
import "./mainpage.scss";

const Footer = React.lazy(() => import("../../layouts/Footer"));
const SideBar = React.lazy(() => import("../../layouts/SideBar"));
const Reports = React.lazy(() => import("../Reports"));
const Error = React.lazy(() => import("../Error"));
const Settings = React.lazy(() => import("../Settings"));
const Dashboard = React.lazy(() => import("../Dashboard"));
const FraudCases = React.lazy(() => import("../FraudCases"));
const Users = React.lazy(() => import("../Users"));

const Negociant = React.lazy(() => import("../Negociant"));

//const socket = io.connect("http://localhost:1338");
const socket = io("https://mylogefserver.onrender.com", {
  transports: ["websocket"],
});

function MainPage() {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const userPermissions = useSelector(
    (state) => state.sessions.authUser
  )?.permissions;

  function showNotificationThis(data) {
    var options = {
      body: data?.signalement?.observation,
      icon: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Coat_of_arms_of_the_Democratic_Republic_of_the_Congo_%28with_background%29.svg",
      dir: "ltr",
    };

    new Notification("Cas suspect signalé", options);
  }

  useEffect(() => {
    socket.on("connected", (data) => {
      if (data?.success) {
        setIsConnected(true);

        if (isConnected)
          showNotification({
            color: "blue",
            title: "Connected to server",
            message: data.message,
            icon: <BsServer size={18} />,
          });
      }
    });

    socket.on("connected_user", (data) => {
      if (data) {
        showNotification({
          color: "blue",
          message: `${data?.username} vient de se connecter`,
        });
      }
    });

    socket.on("added_fraud", async (data) => {
      if (data) {
        await dispatch(addFraud(data));
        showNotificationThis(data && data.results[0]);
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("added_fraud");
      socket.off("connected_user");
      socket.off("connected");
      socket.off("disconnected");
    };
  });

  // useEffect(() => {
  //     console.log('LoggedInUser: ', user)
  // })

  return (
    <div className="app">
      <div className="mainContent" style={{ position: "relative" }}>
        {window.innerWidth <= 1280 ? (
          <div
            className="siderbar"
            style={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              height: "auto",
            }}
          >
            {/* <SideBar /> */}
            <BottomNavigation />
          </div>
        ) : (
          <div className="siderbar">
            <SideBar />
          </div>
        )}

        <div
          className="sectionData"
          style={{ width: window.innerWidth <= 1280 ? "100%" : null }}
        >
          <ErrorBoundary>
            <Suspense fallback={<FullPageLoader />}>
              <Routes>
                {userPermissions?.READ_FRAUD_STATISTICS ? (
                  <Route
                    path="dashboard"
                    element={<Dashboard path="dashboard" />}
                  />
                ) : (
                  <Route path="*" element={<Error error_type={403} />} />
                )}

                {userPermissions?.READ_CASE_DATA ? (
                  <Route
                    path="fraud-cases"
                    element={<FraudCases path="fraud-cases" />}
                  />
                ) : (
                  <Route path="*" element={<Error error_type={403} />} />
                )}

                {userPermissions?.READ_FRAUD_REPORTS ? (
                  <Route path="reports" element={<Reports path="reports" />} />
                ) : (
                  <Route path="*" element={<Error error_type={403} />} />
                )}

                {userPermissions?.READ_SENSITIVE_DATA ? (
                  <Route
                    path="negociants"
                    element={<Negociant path="negociants" />}
                  />
                ) : (
                  <Route path="*" element={<Error error_type={403} />} />
                )}

                {userPermissions?.MODIFY_USERS_INFO ? (
                  <Route path="users" element={<Users path="users" />} />
                ) : (
                  <Route path="*" element={<Error error_type={403} />} />
                )}

                <Route path="settings" element={<Settings path="settings" />} />
                <Route path="*" element={<Error error_type={404} />} />
              </Routes>
              <Footer />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
