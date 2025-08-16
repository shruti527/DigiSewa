// src/components/PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";

function getValidToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const trimmed = token.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;

  // If it's a JWT, optionally verify expiry
  const parts = trimmed.split(".");
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(atob(parts[1]));
      if (payload?.exp && Date.now() >= payload.exp * 1000) return null; // expired
    } catch {
      // If payload can't be parsed, treat as invalid
      return null;
    }
  }

  return trimmed;
}

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const token = getValidToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
