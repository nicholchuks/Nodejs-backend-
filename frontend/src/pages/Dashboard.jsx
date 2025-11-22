import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.username || user?.email}!</p>
    </DashboardLayout>
  );
}
