import { useEffect, useState } from "react";
import { getAllGames, createGame } from "../api/games";
import GameCard from "../components/GameCard";

export default function CompanyDashboard() {
  const [games, setGames] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [release_year, setReleaseYear] = useState("");
  const [season, setSeason] = useState("");
  const [chapters, setChapters] = useState("");
  const [trailer_youtube_url, setTrailerYoutubeUrl] = useState("");
  const [official_site_url, setOfficialSiteUrl] = useState("");
  const [image_url, setImageUrl] = useState("");

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

  const handleCreateGame = async (e) => {
    e.preventDefault();

    try {
      await createGame({
        title,
        description,
        release_year: release_year ? Number(release_year) : null,
        season: season || "",
        chapters: chapters || "",
        trailer_youtube_url: trailer_youtube_url || "",
        official_site_url: official_site_url || "",
        image_url: image_url || null,
      });

      alert("Game published ✅");

      // reset
      setTitle("");
      setDescription("");
      setReleaseYear("");
      setSeason("");
      setChapters("");
      setTrailerYoutubeUrl("");
      setOfficialSiteUrl("");
      setImageUrl("");

      setShowForm(false);

      loadGames();
    } catch (err) {
      console.log(err);

      const msg =
        err?.response?.data?.detail ||
        "Failed to publish game (did you login as a company?)";

      alert(msg);
    }
  };

  return (
    <div className="page">
      <div className="dash-head">
        <div>
          <h2 className="page-title">Company Dashboard</h2>
          <p className="page-sub">Publish games and manage your content</p>
        </div>

        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Game
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-box">
            <h3 className="modal-title">Publish a New Game</h3>

            <form onSubmit={handleCreateGame} className="form">
              <label>Title</label>
              <input
                type="text"
                placeholder="Game title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Description</label>
              <textarea
                placeholder="Game description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label>Release Year</label>
              <input
                type="number"
                placeholder="2025"
                value={release_year}
                onChange={(e) => setReleaseYear(e.target.value)}
              />

              <label>Season</label>
              <input
                type="text"
                placeholder="e.g. Season 1"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              />

              <label>Chapters / Updates</label>
              <input
                type="text"
                placeholder="e.g. Episode 1, Episode 2..."
                value={chapters}
                onChange={(e) => setChapters(e.target.value)}
              />

              <label>Official Site URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={official_site_url}
                onChange={(e) => setOfficialSiteUrl(e.target.value)}
              />

              <label>Trailer YouTube URL</label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={trailer_youtube_url}
                onChange={(e) => setTrailerYoutubeUrl(e.target.value)}
              />

              <label>Cover Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={image_url}
                onChange={(e) => setImageUrl(e.target.value)}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid">
        {games.map((g) => (
          <GameCard key={g.id} game={g} showReviewButton={false} />
        ))}
      </div>
    </div>
  );
}
