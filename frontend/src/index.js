// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SocketProvider } from "./context/SocketContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"; // assume you have AuthContext
import SocketEvents from "./components/SocketEvents";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Root = () => {
  const { token } = useAuth(); // get JWT token from auth context

  return (
    <SocketProvider token={token}>
      <SocketEvents />
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </SocketProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Root />
  </AuthProvider>
);
