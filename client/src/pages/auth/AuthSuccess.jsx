import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { saveUserData } from "../../helper/authHelpers";

function AuthSuccess({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 AuthSuccess useEffect ejecutándose');
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      try {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        console.log('🔓 Token Google decodificado:', decoded);
        
        saveUserData(decoded);
        setUser(decoded);
        
        console.log(`✅ Redirigiendo a /dashboard/${decoded.role}`);
        navigate(`/dashboard/${decoded.role}`, { replace: true });
      } catch (error) {
        console.error("❌ Error al decodificar token:", error);
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, setUser]); // ✅ setUser ahora es estable gracias a useCallback

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Autenticando...</p>
    </div>
  );
}

export default AuthSuccess;