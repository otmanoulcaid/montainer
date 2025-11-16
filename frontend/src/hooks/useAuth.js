import { useState, useEffect } from "react";

export default function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Example: check if user session exists via API
        fetch("http://localhost:3003/api/v1/auth/me", {
            credentials: "include", // send cookie
        })
            .then((res) => {
                if (res.ok) setIsAuthenticated(true);
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    return { isAuthenticated };
}
