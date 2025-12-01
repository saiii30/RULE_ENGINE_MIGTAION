import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./Pagess/Home";
import DashboardPage from "./Pagess/DashboardPage";
import Flow from "./FlowMain/Flow";
import Login from "./Pagess/Login";
import Signup from "./Pagess/Signup";
function App() {
  return (
    <Router>
      <Routes>
        {/* Default: go straight to Home */}
        {/* Default: go straight to Home */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/flow" element={<Flow />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
