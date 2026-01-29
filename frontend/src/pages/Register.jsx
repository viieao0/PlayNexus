import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("company"); // company | youtuber
  const [website_url, setWebsiteUrl] = useState("");
  const [youtube_url, setYoutubeUrl] = useState("");
  const [channel_url, setChannelUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ important: convert FastAPI error detail (array/object) into readable string
  const getErrorMessage = (err) => {
    const detail = err?.response?.data?.detail;

    // 422 validation error from FastAPI = array of objects
    if (Array.isArray(detail)) {
      return detail.map((e) => e?.msg).filter(Boolean).join(" | ");
    }

    if (typeof detail === "string") return detail;

    // sometimes backend returns object
    if (detail && typeof detail === "object") {
      return JSON.stringify(detail);
    }

    return err?.message || "Register failed";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name,
        username,
        email,
        password,
        role,
        channel_url: channel_url || "",
        website_url: website_url || "",
        youtube_url: youtube_url || "",
      };

      // ✅ send to backend
      await registerUser(payload);

      alert("Account created ✅ You can login now");
      nav("/login");
    } catch (err) {
      console.log("REGISTER ERROR:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-wrap">
        <h2 className="page-title">Register</h2>
        <p className="page-sub">
          Create an account as a <b>Company</b> or <b>YouTuber</b>
        </p>

        <form className="form auth-card" onSubmit={handleSubmit}>
          {/* Role */}
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="company">Company</option>
            <option value="youtuber">YouTuber</option>
          </select>

          {/* Basic Info */}
          <label>Name</label>
          <input
            type="text"
            placeholder="Company / YouTuber Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Username</label>
          <input
            type="text"
            placeholder="username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Extra */}
          <label>Website URL (optional)</label>
          <input
            type="text"
            placeholder="https://..."
            value={website_url}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />

          <label>YouTube URL (optional)</label>
          <input
            type="text"
            placeholder="https://youtube.com/..."
            value={youtube_url}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />

          <label>Channel URL (optional)</label>
          <input
            type="text"
            placeholder="https://..."
            value={channel_url}
            onChange={(e) => setChannelUrl(e.target.value)}
          />

          {/* ✅ error will always be string now */}
          {error && (
            <p style={{ color: "#ff4d4d", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
