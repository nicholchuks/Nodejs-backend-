import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <h1>Profile</h1>
      <p>Manage your profile information</p>

      <div style={styles.card}>
        <img
          src={
            user?.avatar || "https://ui-avatars.com/api/?name=" + user?.username
          }
          alt="avatar"
          style={styles.avatar}
        />

        <h2 style={styles.name}>{user?.username}</h2>
        <p style={styles.email}>{user?.email}</p>

        <button style={styles.uploadBtn}>Change Profile Picture</button>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  card: {
    marginTop: "20px",
    padding: "30px",
    borderRadius: "10px",
    background: "white",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
  },
  name: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  email: {
    margin: "4px 0 20px 0",
    color: "#555",
  },
  uploadBtn: {
    padding: "10px",
    background: "#1e1e2f",
    color: "white",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};
