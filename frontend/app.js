// Import React hooks for state management and side effects
import { useEffect, useState } from "react";
// Import axios to make HTTP requests to the backend
import axios from "axios";

function App() {
  // State to store all games fetched from backend
  const [games, setGames] = useState([]);
  // State to store the currently selected game details
  const [selectedGame, setSelectedGame] = useState(null);

  // useEffect runs once when the component loads
  // It fetches all games from the backend API
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/games/")
      .then((res) => setGames(res.data)) // Save games in state
      .catch((err) => console.error("Error fetching games:", err)); // Handle errors
  }, []);

  // Function to fetch details of a single game by ID
  const handleSelect = (id) => {
    axios.get(`http://127.0.0.1:8000/games/${id}`)
      .then((res) => setSelectedGame(res.data)) // Save selected game details
      .catch((err) => console.error("Error fetching game details:", err)); // Handle errors
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {/* Main title */}
      <h1>🎮 PlayNexus</h1>

      {/* Game list section */}
      <h2>Game List</h2>
      <ul>
        {games.map((game) => (
          // Each game is clickable, showing its details when clicked
          <li
            key={game.id}
            onClick={() => handleSelect(game.id)}
            style={{ cursor: "pointer", marginBottom: "0.5rem", color: "#007bff" }}
          >
            {game.title} ({game.release_year})
          </li>
        ))}
      </ul>

      {/* Game details section */}
      {selectedGame && (
        <div style={{ marginTop: "2rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
          <h2>Game Details</h2>
          <p><strong>Title:</strong> {selectedGame.title}</p>
          <p><strong>Description:</strong> {selectedGame.description}</p>
          <p><strong>Release Year:</strong> {selectedGame.release_year}</p>
          <p><strong>Chapters:</strong> {selectedGame.chapters}</p>
        </div>
      )}
    </div>
  );
}

export default App;
