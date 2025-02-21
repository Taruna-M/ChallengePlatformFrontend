import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("/leaderboard/");
        setLeaderboard(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>🏆 Leaderboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "10px", overflow: "hidden" }}>
          <thead>
            <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
              <th style={{ padding: "12px" }}>Rank</th>
              <th style={{ padding: "12px" }}>User</th>
              <th style={{ padding: "12px" }}>Challenges</th>
              <th style={{ padding: "12px" }}>🔥 Streak</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#ecf0f1" : "#fff" }}>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{getRankIcon(index + 1)}</td>
                <td style={{ padding: "12px", color: "black" }}>{entry.user}</td>
                <td style={{ padding: "12px", color: "black" }}>{entry.completed_challenges}</td>
                <td style={{ padding: "12px", fontWeight: "bold", color: entry.streak > 5 ? "red" : "#333" }}>
                  {entry.streak} {entry.streak > 5 ? "🔥" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
