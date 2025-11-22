import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";

export default function Notifications() {
  // Temporary static notifications — later replace with API + WebSocket updates
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to your dashboard!", read: false },
    { id: 2, text: "Your profile was updated successfully.", read: true },
    { id: 3, text: "New security alert from your account.", read: false },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <DashboardLayout>
      <h1>Notifications</h1>
      <p>Stay updated with alerts and important information.</p>

      <div style={styles.list}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              ...styles.item,
              background: n.read ? "#f7f7f7" : "#e8f0ff",
            }}
          >
            <span>{n.text}</span>

            {!n.read && (
              <button style={styles.readBtn} onClick={() => markAsRead(n.id)}>
                Mark as read
              </button>
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <p style={{ color: "#777", marginTop: "20px" }}>
            No notifications yet.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  list: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  item: {
    padding: "15px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  readBtn: {
    padding: "6px 10px",
    background: "#1e1e2f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
};
