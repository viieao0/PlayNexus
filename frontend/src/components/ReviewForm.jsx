import { useState } from "react";
import { createReview } from "../api/reviews";

export default function ReviewForm({ gameId, onClose, onSuccess }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [youtube_url, setYoutubeUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        game_id: gameId,
        content,
        rating: Number(rating),
        youtube_url: youtube_url || null,
      });

      alert("Review submitted ✅");

      // ✅ refresh reviews immediately
      if (onSuccess) onSuccess();

      // close modal
      if (onClose) onClose();
    } catch (err) {
      console.log(err);

      const msg =
        err?.response?.data?.detail ||
        "Failed to submit review (check token / approval)";

      alert(msg);
    }
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3 className="modal-title">Add Review</h3>

        <form onSubmit={handleSubmit} className="form">
          <label>Review Content</label>
          <textarea
            placeholder="Write your review..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <label>Rating (1 - 5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />

          <label>YouTube URL (optional)</label>
          <input
            type="text"
            placeholder="https://youtube.com/..."
            value={youtube_url}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
