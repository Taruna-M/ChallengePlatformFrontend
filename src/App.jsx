import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import ChallengeInterface from "./pages/ChallengeInterface";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/challenges/:id" element={<ChallengeInterface />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
