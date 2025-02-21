import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import MonacoEditor from "@monaco-editor/react";

const ChallengeInterface = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [userSolution, setUserSolution] = useState("# Write your code here\n");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await axios.get(`/challenges/${id}/`);
        setChallenge(response.data);
      } catch (error) {
        console.error("Error fetching challenge:", error);
      }
    };
    fetchChallenge();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/challenges/${id}/submit/`, { solution: userSolution });
      setFeedback(response.data);
    } catch (error) {
      console.error("Error submitting solution:", error);
    }
  };

  return (
    <div style={{ padding: "20px", width: "1000px", margin: "auto" }}>
      <h2>Challenge: {challenge?.name}</h2>
      <p>{challenge?.description}</p>
      <MonacoEditor
        height="200px"
        width="100%"
        language="python"
        theme="vs-dark"
        value={userSolution}
        onChange={(value) => setUserSolution(value)}
      />
      <button onClick={handleSubmit} style={{ padding: "10px", marginTop: "10px", backgroundColor: "green", color: "white" }}>Submit Solution</button>
      {feedback && <p>{feedback.message}</p>}
    </div>
  );
};

export default ChallengeInterface;
