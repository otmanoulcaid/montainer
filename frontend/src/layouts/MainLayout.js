import React from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import "./MainLayout.css";
import { FaHome, FaBoxes, FaChartBar, FaUserTie, FaUserCog, FaSignOutAlt } from "react-icons/fa";

const MainLayout = ({ auth, setAuth }) => {
    const navigate = useNavigate();
    const location = useLocation();

    if (!auth) navigate("/login");

    async function handleLogout() {
        try {
            const response = await fetch("http://localhost:3003/api/v1/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            if (!response.ok) throw new Error("Logout failed");
            setAuth(false);
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    }

    const menuItems = [
        { label: "Home", path: "/", icon: <FaHome /> },
        { label: "Containers", path: "/containers", icon: <FaBoxes /> },
        { label: "Dashboard Ressources", path: "/dashboard", icon: <FaChartBar /> },
        { label: "DevOps Engineers", path: "/users/devops", icon: <FaUserTie /> },
        { label: "Technicien", path: "/users/tech", icon: <FaUserCog /> },
        { label: "Logout", action: handleLogout, icon: <FaSignOutAlt /> },
    ];

    return (
        <div className="layout">
            <aside className="sidebar">
                <h2 className="sidebar-title">Dashboard</h2>
                <nav>
                    <ul>
                        {menuItems.map((item) => (
                            <li
                                key={item.label}
                                className={location.pathname === item.path ? "active" : ""}
                                onClick={item.action ? item.action : undefined}
                            >
                                {item.icon}
                                {item.path ? (
                                    <Link to={item.path}>{item.label}</Link>
                                ) : (
                                    <span>{item.label}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
