import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>MyApp</h2>

        <nav style={styles.nav}>
          <Link style={styles.link} to="/dashboard">
            Dashboard
          </Link>
          <Link style={styles.link} to="/settings">
            Settings
          </Link>
          <Link style={styles.link} to="/profile">
            Profile
          </Link>
        </nav>

        <div style={styles.footer}>
          <p style={styles.user}>
            Logged in as: <br />{" "}
            <strong>{user?.username || user?.email}</strong>
          </p>

          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },
  sidebar: {
    width: "240px",
    background: "#1e1e2f",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "24px",
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },
  footer: {
    marginTop: "30px",
  },
  user: {
    fontSize: "14px",
    marginBottom: "10px",
  },
  logoutBtn: {
    width: "100%",
    padding: "10px",
    background: "#ff4d4d",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
  main: {
    flexGrow: 1,
    padding: "30px",
    background: "#f5f6fa",
    overflowY: "auto",
  },
};
