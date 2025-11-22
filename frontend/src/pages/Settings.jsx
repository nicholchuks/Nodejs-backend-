import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    alert("Settings saved! (API connection coming next)");
  };

  return (
    <DashboardLayout>
      <h1>Settings</h1>
      <p>Manage your account settings</p>

      <div style={styles.form}>
        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={styles.label}>New Password</label>
        <input
          type="password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.saveBtn} onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  saveBtn: {
    padding: "10px",
    background: "#1e1e2f",
    color: "white",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
};
