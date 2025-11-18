import { Link } from "react-router-dom";
import "./Home.css"; // optional, for better styling

export default function Home() {
    return (
        <div className="home-container">
            {/* Hero section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Montainer</h1>
                    <p>
                        <span>Montainer </span>
                        is a container manager where you can manage your Docker containers effortlessly.
                        Start, stop, restart,create, or delete containers and visualize resource
                        utilization in real-time.
                    </p>
                    <Link to="/containers" className="hero-btn">
                        Get Started
                    </Link>
                </div>
                <div className="hero-image">
                    <img
                        src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png"
                        alt="Docker Logo"
                    />
                </div>
            </section>

            {/* Features section */}
            <section className="features">
                <h2>Key Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Container Management</h3>
                        <p>Start, stop, restart, create, or delete containers easily.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Monitoring</h3>
                        <p>Track CPU, memory, and network usage of your containers in real-time.</p>
                    </div>
                    <div className="feature-card">
                        <h3>User-Friendly</h3>
                        <p>Intuitive interface for developers and operations teams.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Secure</h3>
                        <p>Manage containers safely with proper user roles and permissions.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Docker Manager. All rights reserved.</p>
            </footer>
        </div>
    );
}
