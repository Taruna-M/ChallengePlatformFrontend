import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const Dashboard = () => {
  const [progress, setProgress] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [user, setUser] = useState({ username: "User ", streak: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, challengesRes, achievementsRes, leaderboardRes] = await Promise.all([
          axios.get("/progress/"),
          axios.get("/challenges/"),
          axios.get("/user-achievements/"),
          axios.get("/leaderboard/")
        ]);

        setProgress(progressRes.data);
        setChallenges(challengesRes.data);
        console.log(achievementsRes.data);
        setAchievements(achievementsRes.data);

        const userEntry = leaderboardRes.data.find(entry => entry.user === progressRes.data[0]?.user?.username);
        setUser({
          username: progressRes.data[0]?.user?.username || "User ",
          streak: userEntry?.streak || 0,
          completed: progressRes.data.filter(item => item.status === "completed").length
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalChallenges = challenges.length;
  const completedChallenges = progress.filter(item => item.status === "completed").length;
  const startedChallenges = progress.filter(item => item.status !== "completed").length;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/auth/login");
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "10px", maxWidth: "900px", margin: "auto" }}>
      <nav style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", padding: "10px", borderBottom: "1px solid #ddd", gap: "10px" }}>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "10px" }}>Dashboard</button>
        <button onClick={() => navigate("/leaderboard")} style={{ padding: "10px" }}>Leaderboard</button>
        <a href={`https://t.me/TaruTunaTarunaBot?start=${encodeURIComponent(`token_${token}`)}`} target="_blank" rel="noopener noreferrer">
  <button>Chat with Bot</button>
</a>

        <button onClick={() => handleScrollTo("welcome")} style={{ padding: "10px" }}>Welcome</button>
        <button onClick={() => handleScrollTo("achievements")} style={{ padding: "10px" }}>Achievements</button>
        <button onClick={() => handleScrollTo("available-challenges")} style={{ padding: "10px" }}>Available Challenges</button>
        <button onClick={() => handleScrollTo("challenges-in-progress")} style={{ padding: "10px" }}>Challenges In Progress</button>
        <button onClick={() => handleScrollTo("completed-challenges")} style={{ padding: "10px" }}>Completed Challenges</button>
        <button onClick={handleLogout} style={{ padding: "10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Logout</button>
      </nav>

      <div id="welcome" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
        <h2>Dashboard</h2>
        <h3>Welcome, {user.username}!</h3>
        <p>🔥 Streak: {user.streak} days</p>
        <p>✅ Completed Challenges: {completedChallenges}</p>
        <p>⏳ Started but not completed: {startedChallenges}</p>
        <p>🎯 Total Challenges Available: {totalChallenges}</p>
      </div>
      <hr/>
      <div id="achievements">
        <h3>🏆 Your Achievements</h3>
        {achievements.length > 0 ? (
          <ul className="list-group mt-3">
            {achievements.map((achievement) => (
              <li key={achievement.id} className="list-group-item">
                <strong>{achievement.achievement.title}</strong> - {achievement.achievement.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No achievements yet. Keep completing challenges!</p>
        )}
      </div>
      <hr/>
      <div id="available-challenges">
        <h3>Available Challenges</h3>
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <div key={challenge.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
              <p><strong>Challenge:</strong> {challenge.title}</p>
              <button onClick={() => navigate(`/challenges/${challenge.id}`)} style={{ padding: "10px", backgroundColor: "blue", color: "white" }}>Attempt Challenge</button>
            </div>
          ))
        ) : (
          <p>No challenges available.</p>
        )}
      </div>
      <hr/>
      <div id="challenges-in-progress">
        <h3>Challenges In Progress</h3>
        {progress.length > 0 ? (
          progress.filter(item => item.status !== "completed").map((item) => (
            <div key={item.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
              <p><strong>Challenge:</strong> {challenges.find(c => c.id === item.challenge)?.title || `Challenge ${item.challenge}`}</p>
              <p><strong>Attempts:</strong> {item.attempts}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <button onClick={() => navigate(`/challenges/${item.challenge}`)} style={{ padding: "10px", backgroundColor: "blue", color: "white" }}>Continue Challenge</button>
            </div>
          ))
        ) : (
          <p>No challenges in progress.</p>
        )}
      </div>
      <hr/>
      <div id="completed-challenges">
        <h3>Challenges Completed</h3>
        {progress.length > 0 ? (
          progress.filter(item => item.status == "completed").map((item) => (
            <div key={item.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
              <p><strong>Challenge:</strong> {challenges.find(c => c.id === item.challenge)?.title || `Challenge ${item.challenge}`}</p>
              <p><strong>Attempts:</strong> {item.attempts}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <button onClick={() => navigate(`/challenges/${item.challenge}`)} style={{ padding: "10px", backgroundColor: "green", color: "white" }}>Write New Solution</button>
            </div>
          ))
        ) : (
          <p>No challenges completed.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;