import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, role, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Hide navbar on login/register if you want
  // (اختياري) إذا تبين يختفي بالشاشات
  // const hideOnAuthPages = ["/login", "/register"].includes(location.pathname);
  // if (hideOnAuthPages) return null;

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        {/* Left: Brand */}
        <Link to="/" className="brand">
          PlayNexus
        </Link>

        {/* Right: Links */}
        <div className="topbar-links">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className={location.pathname === "/login" ? "nav-link active" : "nav-link"}
              >
                Login
              </Link>

              <Link
                to="/register"
                className={location.pathname === "/register" ? "nav-link active" : "nav-link"}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Dashboard shortcut */}
              {role === "company" && (
                <Link
                  to="/company"
                  className={location.pathname === "/company" ? "nav-link active" : "nav-link"}
                >
                  Company Dashboard
                </Link>
              )}

              {role === "youtuber" && (
                <Link
                  to="/youtuber"
                  className={location.pathname === "/youtuber" ? "nav-link active" : "nav-link"}
                >
                  YouTuber Dashboard
                </Link>
              )}

              <span className="nav-user">
                {user?.username || "user"}
              </span>

              <button onClick={handleLogout} className="btn-nav">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
