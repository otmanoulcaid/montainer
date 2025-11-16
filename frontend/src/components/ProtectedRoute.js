import React from "react";
import { Navigate } from "react-router-dom";

// You can use context, redux, or a custom hook to check auth
export default function ProtectedRoute({ children, isAuthenticated }) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
