import React, { useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = ({ setAuth }) => {
    // State to toggle dropdowns

    const [showContainers, setShowContainers] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    let navigate = useNavigate()

    function containerClickHandler() {
        setShowContainers(!showContainers);
    }

    function userClickHandler() {
        setShowUsers(!showUsers);
    }

    async function handleLogout() {
        try {
            const response = await fetch("http://localhost:3003/api/v1/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Login failed");
            }
            console.log(await response.json());
            setAuth(false);
            navigate("/");
        } catch (err) {
        }
    }

    return (
        <div className="layout">
            <aside className="sidebar">
                <h2>Menu</h2>
                <nav>
                    <ul>
                        <li className="home"><Link to="/">Home</Link></li>

                        {/* Containers dropdown */}
                        <li>
                            <button
                                className={`dropdown-btn ${showContainers ? "open" : ""}`}
                                onClick={containerClickHandler}
                            >
                                Containers
                            </button>
                            {showContainers && (
                                <ul className="dropdown">
                                    <li><Link to="/containers">Containers</Link></li>
                                    <li><Link to="/stats">Stats</Link></li>
                                </ul>
                            )}
                        </li>

                        {/* Users dropdown */}
                        <li>
                            <button
                                className={`dropdown-btn ${showUsers ? "open" : ""}`}
                                onClick={userClickHandler}
                            >
                                Users
                            </button>
                            {showUsers && (
                                <ul className="dropdown">
                                    <li><Link to="/users/devops">DevOps</Link></li>
                                    <li><Link to="/users/technicien">Technicians</Link></li>
                                </ul>
                            )}
                        </li>
                        <li onClick={handleLogout}>logout</li>
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
