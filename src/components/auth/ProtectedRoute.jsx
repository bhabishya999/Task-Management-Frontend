import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function isTokenValid() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return false;

        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );

        const payload = JSON.parse(jsonPayload);

        if (!payload.exp) return false;

        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

export default function ProtectedRoute({ children }) {
    const location = useLocation();

    if (!isTokenValid()) {
        return <Navigate to="/401" state={{ from: location }} replace />;
    }

    return children;
}
