import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Login from "../src/pages/auth/login";
import AuthSuccess from "../src/pages/auth/AuthSuccess"; 
//import UserDashboard from "./pages/Dashboard/UserDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

// Importaciones para el modo desarrollo
import { developmentConfig } from "./config/development";
import ComponentSandbox from "./assets/components/development/ComponentSandbox";

function App() {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken"); // guarda el JWT cuando haces login
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token); // here we get { id, email, role, iat, exp, ... }
      // optional: validating token expiration
      if (user.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        user = null;
      }
    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
    }
  }

  if (developmentConfig.enableComponentSandbox) {
    console.log('🔧 Modo desarrollo activo - Mostrando ComponentSandbox');
  }

  return (
    <Router>
      {developmentConfig.enableComponentSandbox ? (
        <ComponentSandbox activeComponent={developmentConfig.activeComponent} />
      ) : (
        <Routes>
          {/* Ruta de login */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          
          {/* NUEVA RUTA: Auth success callback de Google */}
          <Route path="/auth-success" element={<AuthSuccess />} />

          {/* if there is no users, it redirects to login page */}
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : (
                <Navigate to={user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"} />
              )
            }
          />

          {/* Protected Dashboards */}
          <Route
            path="/dashboard/user"
            element={user?.role === "user" ? <UserDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/admin"
            element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          
          {/* NUEVA RUTA: Dashboard general (sin rol específico) */}
          <Route
            path="/dashboard"
            element={user ? <AdminDashboard /> : <Navigate to="/login" />}
          />

          {/* default redirection */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;

/*
PASO 1: Para desarrollar tu sidebar
- Ve a src/config/development.js
- Asegúrate de que enableComponentSandbox = true
- Cambia activeComponent = 'sidebar'
- Ejecuta npm run dev

PASO 2: Para desarrollar dashboard completo  
- Cambia activeComponent = 'dashboard'

PASO 3: Para ver múltiples componentes
- Cambia activeComponent = 'components-showcase'

PASO 4: Para volver al flujo normal de la aplicación
- Cambia enableComponentSandbox = false
- Tu lógica de autenticación volverá a funcionar normalmente

VENTAJAS DE ESTE ENFOQUE:
✅ No interfiere con tu lógica de autenticación existente
✅ Te permite desarrollar componentes de manera aislada
✅ Fácil de activar/desactivar
✅ Puedes simular diferentes estados de la aplicación
✅ Ideal para mostrar tu trabajo a clientes o teammates
✅ Extensible - puedes agregar más componentes fácilmente
*/