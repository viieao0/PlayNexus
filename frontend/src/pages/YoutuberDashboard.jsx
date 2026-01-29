import { useEffect, useState } from "react";
import { getAllGames } from "../api/games";
import GameCard from "../components/GameCard";
import ReviewForm from "../components/ReviewForm";

export default function YoutuberDashboard() {
  const [games, setGames] = useState([]);

  const [selectedGameId, setSelectedGameId] = useState(null);
  const [refreshReviewsFn, setRefreshReviewsFn] = useState(null);

  const loadGames = async () => {
    try {
      const data = await getAllGames();
      setGames(data);
    } catch (err) {
      console.log(err);
      alert("Failed to load games");
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  // ✅ open review modal and store refresh callback for that game card
  const openReviewModal = (gameId, refreshFn) => {
    setSelectedGameId(gameId);
    setRefreshReviewsFn(() => refreshFn);
  };

  const closeReviewModal = () => {
    setSelectedGameId(null);
    setRefreshReviewsFn(null);
  };

  return (
    <div className="page">
      <div className="dash-head">
        <div>
          <h2 className="page-title">YouTuber Dashboard</h2>
          <p className="page-sub">
            Browse games and leave reviews with your YouTube link
          </p>
        </div>
      </div>

      {/* ✅ Review Form Modal */}
      {selectedGameId && (
        <ReviewForm
          gameId={selectedGameId}
          onClose={closeReviewModal}
          onSuccess={() => {
            // ✅ refresh reviews immediately after submit
            if (refreshReviewsFn) refreshReviewsFn();
          }}
        />
      )}

      <div className="grid">
        {games.map((g) => (
          <GameCard
            key={g.id}
            game={g}
            showReviewButton={true}
            onOpenReview={openReviewModal}
          />
        ))}
      </div>
    </div>
  );
}
