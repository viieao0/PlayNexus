import { useAuth } from "../context/AuthContext";

export default function PendingApproval() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1 style={{ fontSize: "38px" }}>⏳ Pending Approval</h1>
      <p style={{ marginTop: "10px", fontSize: "18px", opacity: 0.85 }}>
        Hi <b>{user?.username}</b>, your YouTuber account is waiting for a company
        to approve your request.
      </p>

      <div style={{ marginTop: "25px" }}>
        <button
          onClick={logout}
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
