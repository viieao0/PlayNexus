import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use login() from context

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const data = await loginUser({ username, password });

      console.log("LOGIN RESPONSE:", data);

      const token = data?.access_token;
      const user = data?.user;

      if (!token || !user) {
        setErrorMsg("Login failed: invalid server response");
        return;
      }

      // ✅ update context + localStorage (context does both)
      login(token, user);

      // ✅ route based on role
      if (user.role === "company") {
        navigate("/company", { replace: true });
      } else if (user.role === "youtuber") {
        navigate("/youtuber", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.log(err);

      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Login failed";

      setErrorMsg(msg);
    }
  };

  return (
    <div className="page">
      <div className="auth-wrap">
        <div className="auth-box">
          <h2 className="auth-title">Login</h2>

          <form className="form" onSubmit={handleLogin}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              placeholder="Enter username..."
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter password..."
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {errorMsg && <p style={{ color: "#ff6b6b" }}>{errorMsg}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>
          </form>

          <p className="muted" style={{ marginTop: "12px" }}>
            No account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
