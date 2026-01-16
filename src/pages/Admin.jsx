import { useState } from "react";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  return loggedIn ? (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}
