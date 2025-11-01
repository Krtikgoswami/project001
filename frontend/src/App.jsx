import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login.jsx";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import AdminDashboard from "./admindashboard.jsx"; // 👈 import your new page

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Normal user dashboard */}
        <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />

        {/* Admin-only dashboard */}
        <Route
          path="/admindashboard"
          element={
            user?.role === "admin" ? (
              <AdminDashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" /> // redirect if not admin
            )
          }
        />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
