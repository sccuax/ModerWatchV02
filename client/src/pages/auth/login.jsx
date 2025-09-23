import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "123456" }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      // luego rediriges según rol
      const decoded = JSON.parse(atob(data.token.split(".")[1]));
      navigate(decoded.role === "admin" ? "/dashboard/admin" : "/dashboard/user");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
}

export default Login;
