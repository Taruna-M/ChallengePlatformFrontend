import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Remove authorization header
    delete axios.defaults.headers.common["Authorization"];

    // Redirect to login
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: "20px" }}>
      Logout
    </button>
  );
};

export default Logout;
