import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Login from "./pages/Auth/Login";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

function App() {
  const token = localStorage.getItem("token"); // guarda el JWT cuando haces login
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token); // here we get { id, email, role, iat, exp, ... }
      // optional: validating token expiration
      if (user.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        user = null;
      }
    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("token");
    }
  }

  return (
    <Router>
      <Routes>
        {/* if there is no users, it redirects to login page */}
        <Route
          path="/"
          element={
            !user ? (
              <Login />
            ) : (
              <Navigate to={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"} />
            )
          }
        />

        {/* Protected Dashboards */}
        <Route
          path="/dashboard/user"
          element={user?.role === "user" ? <UserDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard/admin"
          element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
        />

        {/* default redirection */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
