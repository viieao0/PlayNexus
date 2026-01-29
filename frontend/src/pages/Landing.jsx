import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      {/* TOP BAR */}
      <div className="landing-top">
        <h1 className="brand">PlayNexus</h1>

        <div className="top-actions">
          <Link to="/login" className="btn-outline small">
            Login
          </Link>
          <Link to="/register" className="btn-primary small">
            Register
          </Link>
        </div>
      </div>

      {/* HERO */}
      <div className="landing-content">
        <h2 className="hero-title">
          WHERE GAMES MEET <br />
          <span className="hero-gradient">THEIR AUDIENCE</span>
        </h2>

        <p className="hero-desc">
          PlayNexus is a platform that connects game companies with content
          creators. Companies publish their games, and approved YouTubers share
          honest reviews, ratings, and gameplay.
        </p>
      </div>
    </div>
  );
}
