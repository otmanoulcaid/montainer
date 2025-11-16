import { useState, useEffect } from "react";

export default function useAuth() {
    let [isAuthenticated, setIsAuthenticated] = useState(false); // null = inconnu
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3003/api/v1/auth/me", {
            credentials: "include",
        })
            .then(res => {
                setIsAuthenticated(res.ok)
            })
            .catch(() => {
                setIsAuthenticated(false)
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return [isAuthenticated, setIsAuthenticated, loading];
}
