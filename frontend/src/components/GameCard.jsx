import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviewsByGame } from "../api/reviews";

export default function GameCard({ game, showReviewButton, onOpenReview }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  const loadReviews = async () => {
    const data = await getReviewsByGame(game.id);
    setReviews(data);
  };

  const handleLoadReviews = async () => {
    try {
      await loadReviews();
      setOpen((prev) => !prev);
    } catch (err) {
      console.log(err);
      alert("No reviews found yet");
    }
  };

  // ✅ this will be called after submitting review
  const handleRefreshReviews = async () => {
    try {
      await loadReviews();
      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleViewDetails = () => {
    navigate(`/games/${game.id}`);
  };

  return (
    <div className="card">
      {/* ✅ Cover image */}
      {game.image_url && (
        <div className="card-cover">
          <img
            src={game.image_url}
            alt={game.title}
            className="card-cover-img"
            loading="lazy"
            onError={(e) => {
              // ✅ hide broken image instead of ugly broken icon
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <h3 className="card-title">{game.title}</h3>

      <p className="card-desc">
        {game.description || "No description provided."}
      </p>

      <div className="card-meta">
        <span>Year: {game.release_year || "N/A"}</span>
      </div>

      <div className="card-actions">
        {/* ✅ details button */}
        <button className="btn-outline" onClick={handleViewDetails}>
          View Details
        </button>

        {/* ✅ reviews button */}
        <button className="btn-outline" onClick={handleLoadReviews}>
          {open ? "Hide Reviews" : "View Reviews"}
        </button>

        {showReviewButton && (
          <button
            className="btn-primary"
            onClick={() => onOpenReview(game.id, handleRefreshReviews)}
          >
            Add Review
          </button>
        )}
      </div>

      {open && (
        <div className="reviews-box">
          {reviews.length === 0 ? (
            <p className="muted">No reviews yet</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="review-item">
                <p className="review-rating">⭐ {r.rating}/5</p>
                <p>{r.content}</p>

                {r.youtube_url && (
                  <a href={r.youtube_url} target="_blank" rel="noreferrer">
                    YouTube Review
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
