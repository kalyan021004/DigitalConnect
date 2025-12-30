import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🔐 Role-based protection
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authorized
  return children;
}
