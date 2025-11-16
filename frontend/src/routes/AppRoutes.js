import ProtectedRoute from "../components/ProtectedRoute";
import Containers from "../pages/containers/Container";
import DashboardStats from "../pages/stats/DashboardStats";
import DevOps from "../pages/users/DevOps";
import Technicien from "../pages/users/Technicien";
import useAuth from '../hooks/useAuth'
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes(auth) {

  return (
    <Routes>
      <Route path="/login" element={<Login {...auth} />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute isAuthenticated={auth.auth}><MainLayout {...auth} /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />  {/* add this line */}
        <Route path="containers" element={<Containers />} />
        <Route path="stats" element={<DashboardStats />} />
        <Route path="users/devops" element={<DevOps />} />
        <Route path="users/technicien" element={<Technicien />} />
      </Route>

    </Routes>
  );
}
