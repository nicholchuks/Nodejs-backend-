// src/App.jsx
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import TaskList from "./pages/TaskList";
import SocketEvents from "./components/SocketEvents";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="App">
          <h1>My Task App</h1>
          {/* Task list will update in real-time */}
          <TaskList />
          {/* Socket event listener */}
          <SocketEvents />
          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
