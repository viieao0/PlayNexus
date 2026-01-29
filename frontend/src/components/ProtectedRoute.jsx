import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading, isLoggedIn } = useAuth();
  const location = useLocation();

  // ✅ wait for auth init
  if (loading) {
    return (
      <div className="page">
        <h2 className="page-title">Loading...</h2>
      </div>
    );
  }

  // ✅ Not logged in
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // ✅ Role protected
  if (role && user.role !== role) {
    if (user.role === "company") return <Navigate to="/company" replace />;
    if (user.role === "youtuber") return <Navigate to="/youtuber" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
