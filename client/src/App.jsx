import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useCallback } from "react"; // ✅ Importa useCallback

import Login from "../src/pages/auth/login";
import AuthSuccess from "../src/pages/auth/AuthSuccess"; 
import UserDashboard from "./pages/Dashboard/UserDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import SignUp from './pages/auth/SignUp'

// Importaciones para el modo desarrollo
import { developmentConfig } from "./config/development";
import ComponentSandbox from "./assets/components/development/ComponentSandbox";

// ✅ Componente de ruta protegida
function ProtectedRoute({ children, user, allowedRole }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }
  
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ SOLUCIÓN: Envuelve setUser en useCallback para que no cambie en cada render
  const handleSetUser = useCallback((userData) => {
    console.log('📝 Actualizando usuario:', userData);
    setUser(userData);
  }, []);

  useEffect(() => {
    console.log('🔄 App useEffect ejecutándose');
    const token = localStorage.getItem("token") || localStorage.getItem("authToken"); 
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('🔍 Token decodificado:', decoded);
        
        if (decoded.exp * 1000 > Date.now()) {
          console.log('✅ Estableciendo usuario:', decoded);
          setUser(decoded);
        } else {
          console.log('❌ Token expirado');
          localStorage.clear();
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error al decodificar token:", error);
        localStorage.clear();
        setUser(null);
      }
    }
    
    setLoading(false);
  }, []); // ✅ Array vacío - solo se ejecuta UNA vez al montar

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  if (developmentConfig.enableComponentSandbox) {
    console.log('🔧 Modo desarrollo activo');
  }

  return (
    <Router>
      {developmentConfig.enableComponentSandbox ? (
        <ComponentSandbox activeComponent={developmentConfig.activeComponent} />
      ) : (
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <Login setUser={handleSetUser} />}
          />

          <Route
            path="/signup"
            element={user ? <Navigate to={`/dashboard/${user.role}`} replace /> : <SignUp />}
          />
          
          <Route path="/auth-success" element={<AuthSuccess setUser={handleSetUser} />} />

          {/* Ruta raíz */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={`/dashboard/${user.role}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Dashboard general */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <Navigate to={`/dashboard/${user.role}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Dashboard de user */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute user={user} allowedRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dashboard de admin */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
