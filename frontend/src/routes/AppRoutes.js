import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import UserCard from "../pages/users/UserCard";
import MainLayout from "../layouts/MainLayout";
import UserListPage from "../pages/users/UserListPage";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardStats from "../pages/stats/DashboardStats";
import ContainerList from "../pages/containers/ContainerList";
import CreateContainer from "../pages/containers/CreateContainer";
import ContainerDetails from "../pages/containers/ContainerDetails";

export default function AppRoutes(auth) {
  return (
    <Routes>
      <Route path="/login" element={<Login {...auth} />} />

      <Route path="/" element={<ProtectedRoute isAuthenticated={auth.auth}><MainLayout {...auth} /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="containers" element={<ContainerList />} />
        <Route path="dashboard" element={<DashboardStats />} />
        <Route path="users/:role" element={<UserListPage />} />
        <Route path="profile/:id" element={<UserCard />} />
        <Route path="/containers/:id" element={<ContainerDetails />} />
        <Route path="/containers/new" element={<CreateContainer />} />
      </Route>

    </Routes>
  );
}
