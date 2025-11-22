import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";

export default function Messages() {
  const { user, token } = useAuth(); // get logged-in user info
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // Connect to WebSocket
  useEffect(() => {
    if (!token) return;

    const socketInstance = io("http://localhost:5000", {
      auth: { token },
    });

    socketInstance.on("connect", () => {
      console.log("🟢 Connected to WebSocket:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔴 Disconnected from WebSocket");
    });

    // Listen for messages from server
    socketInstance.on("roomMessage", (msg) => {
      setMessages((prev) => [...prev, { ...msg, sender: "Admin" }]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const message = {
      message: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("testRoomMessage", message); // send to server
    setMessages((prev) => [...prev, { ...message, sender: "You" }]);
    setNewMessage("");
  };

  return (
    <DashboardLayout>
      <h1>Messages</h1>
      <div style={styles.chatContainer}>
        <div style={styles.messageList}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
                background: msg.sender === "You" ? "#4f46e5" : "#f3f4f6",
                color: msg.sender === "You" ? "white" : "black",
              }}
            >
              <p style={{ margin: 0 }}>{msg.message}</p>
              <small>{msg.time}</small>
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendBtn}>
            Send
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
    height: "70vh",
  },
  messageList: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fafafa",
  },
  message: { padding: "10px 14px", borderRadius: "12px", maxWidth: "60%" },
  inputContainer: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  sendBtn: {
    padding: "10px 15px",
    borderRadius: "8px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

// import DashboardLayout from "../layouts/DashboardLayout";
// import { useState } from "react";

// export default function Messages() {
//   const [messages, setMessages] = useState([
//     { id: 1, sender: "Admin", text: "Welcome to the chat!", time: "10:00 AM" },
//     { id: 2, sender: "You", text: "Hello there!", time: "10:02 AM" },
//   ]);
//   const [newMessage, setNewMessage] = useState("");

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     const message = {
//       id: messages.length + 1,
//       sender: "You",
//       text: newMessage,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setMessages((prev) => [...prev, message]);
//     setNewMessage("");
//   };

//   return (
//     <DashboardLayout>
//       <h1>Messages</h1>
//       <p>
//         Chat with admins or other users (placeholder for WebSocket integration)
//       </p>

//       <div style={styles.chatContainer}>
//         <div style={styles.messageList}>
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               style={{
//                 ...styles.message,
//                 alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
//                 background: msg.sender === "You" ? "#4f46e5" : "#f3f4f6",
//                 color: msg.sender === "You" ? "white" : "black",
//               }}
//             >
//               <p style={{ margin: 0 }}>{msg.text}</p>
//               <small>{msg.time}</small>
//             </div>
//           ))}
//         </div>

//         <div style={styles.inputContainer}>
//           <input
//             type="text"
//             placeholder="Type your message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             style={styles.input}
//           />
//           <button onClick={sendMessage} style={styles.sendBtn}>
//             Send
//           </button>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// const styles = {
//   chatContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//     marginTop: "20px",
//     height: "70vh",
//   },
//   messageList: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     overflowY: "auto",
//     padding: "10px",
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//     background: "#fafafa",
//   },
//   message: {
//     padding: "10px 14px",
//     borderRadius: "12px",
//     maxWidth: "60%",
//   },
//   inputContainer: {
//     display: "flex",
//     gap: "10px",
//   },
//   input: {
//     flex: 1,
//     padding: "10px",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//   },
//   sendBtn: {
//     padding: "10px 15px",
//     borderRadius: "8px",
//     background: "#4f46e5",
//     color: "white",
//     border: "none",
//     cursor: "pointer",
//   },
// };
