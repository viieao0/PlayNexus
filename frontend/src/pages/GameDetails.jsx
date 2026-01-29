import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGameById } from "../api/games";
import { getReviewsByGame } from "../api/reviews";
import "../styles/game-details.css";

function toYouTubeEmbed(url) {
  if (!url) return "";
  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    // youtube.com/watch?v=<id>
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;

    // youtube.com/embed/<id>
    if (u.pathname.startsWith("/embed/")) return url;

    return "";
  } catch (e) {
    return "";
  }
}

function extractYoutubeChannelOrUser(url) {
  // optional helper لو تبين تسوين "Company YouTube" من trailer link
  // بيرجع رابط القناة تقريباً اذا كانت موجودة باللينك
  if (!url) return "";
  try {
    const u = new URL(url);

    // لا توجد طريقة دقيقة بدون API
    // لكن نخليها فقط يرجع YouTube home كبديل
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      return "https://www.youtube.com/";
    }

    return "";
  } catch {
    return "";
  }
}

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingGame, setLoadingGame] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState("");

  const embedUrl = useMemo(
    () => toYouTubeEmbed(game?.trailer_youtube_url),
    [game]
  );

  const companyYoutubeUrl = useMemo(
    () => extractYoutubeChannelOrUser(game?.trailer_youtube_url),
    [game]
  );

  const load = async () => {
    setLoadingGame(true);
    setError("");
    try {
      const data = await getGameById(id);
      setGame(data);
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.detail ||
          "Failed to load game details. Make sure GET /games/{id} is working."
      );
    } finally {
      setLoadingGame(false);
    }
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await getReviewsByGame(Number(id));
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    load();
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loadingGame) {
    return (
      <div className="page">
        <div className="gd-wrap">
          <div className="gd-skel hero-skel" />
          <div className="gd-skel line-skel" />
          <div className="gd-skel line-skel short" />
          <div className="gd-skel box-skel" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="gd-wrap">
          <div className="gd-error">
            <h2>Something went wrong</h2>
            <p className="muted">{error}</p>

            <div className="gd-actions">
              <button className="btn-outline" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <button className="btn-primary" onClick={load}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="page">
      <div className="gd-wrap">
        {/* Top bar */}
        <div className="gd-topbar">
          <button className="btn-outline" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="gd-topmeta">
            <span className="gd-pill">Game ID: {game.id}</span>
            <span className="gd-pill">Company: {game.company_id}</span>
            <span className="gd-pill">Year: {game.release_year || "N/A"}</span>
          </div>
        </div>

        {/* Hero */}
        <div className="gd-hero">
          <div className="gd-cover">
            {game.image_url ? (
              <img
                src={game.image_url}
                alt={game.title}
                className="gd-cover-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="gd-cover-empty">
                <span>No cover image</span>
              </div>
            )}

            <div className="gd-cover-glow" />
          </div>

          <div className="gd-info">
            <h1 className="gd-title">{game.title}</h1>
            <p className="gd-desc">
              {game.description || "No description provided."}
            </p>

            {/* ✅ Buttons (only if exists) */}
            <div className="gd-cta">
              {game.official_site_url && (
                <a
                  className="btn-primary"
                  href={game.official_site_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit Official Website
                </a>
              )}

              {game.trailer_youtube_url && (
                <a
                  className="btn-outline"
                  href={game.trailer_youtube_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch Trailer
                </a>
              )}
            </div>

            {/* ✅ Show only fields user actually entered */}
            <div className="gd-specs">
              {game.chapters && (
                <div className="gd-spec">
                  <div className="gd-spec-k">Chapters / Updates</div>
                  <div className="gd-spec-v">{game.chapters}</div>
                </div>
              )}

              {/* ✅ Company Links (optional) */}
              {(game.official_site_url || companyYoutubeUrl) && (
                <div className="gd-spec">
                  <div className="gd-spec-k">Company Links</div>

                  <div className="gd-spec-v">
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {companyYoutubeUrl && (
                        <a
                          className="btn-outline"
                          href={companyYoutubeUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Company YouTube
                        </a>
                      )}

                      {game.official_site_url && (
                        <a
                          className="btn-outline"
                          href={game.official_site_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Company Website
                        </a>
                      )}
                    </div>

                    <p className="muted" style={{ marginTop: 10 }}>
                      (These are derived from available game links)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trailer section (only if embeddable) */}
        {embedUrl && (
          <div className="gd-section">
            <div className="gd-section-title">
              <h2>Trailer</h2>
              <p className="muted">Embedded preview</p>
            </div>

            <div className="gd-video">
              <iframe
                src={embedUrl}
                title="YouTube trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Reviews section */}
        <div className="gd-section">
          <div className="gd-section-title">
            <h2>Reviews</h2>
            <div className="gd-section-actions">
              <button className="btn-outline" onClick={loadReviews}>
                {loadingReviews ? "Loading..." : "Refresh Reviews"}
              </button>
            </div>
          </div>

          <div className="gd-reviews">
            {reviews.length === 0 ? (
              <div className="gd-empty">
                <p className="muted">No reviews yet</p>
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="gd-review">
                  <div className="gd-review-head">
                    <span className="gd-rating">⭐ {r.rating}/5</span>
                    <span className="gd-review-id">Review #{r.id}</span>
                  </div>

                  <p className="gd-review-text">{r.content}</p>

                  {r.youtube_url && (
                    <a
                      className="gd-review-link"
                      href={r.youtube_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      YouTube Review →
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
