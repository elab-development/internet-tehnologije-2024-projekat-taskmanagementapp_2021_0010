import { useState } from "react";
import apiAuth from "../api/axiosAuth"; // koristi istu instancu kao register
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ prvo uzmi CSRF cookie
      await apiAuth.get("/sanctum/csrf-cookie");

      // 2️⃣ pošalji login zahtev
      const res = await apiAuth.post("/api/v1/login", { email, password });

      // 3️⃣ možeš sačuvati token ako želiš u localStorage
      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 4️⃣ redirekcija na dashboard
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={logo} alt="Logo" className="app-logo" />
        <h1 className="app-title">Task Management App</h1>
        <p className="welcome-text">Welcome back! Please log in</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="pink-btn login-btn">
            Login
          </button>

          <p className="auth-footer">
            Don’t have an account? <a href="/register">Register</a>
          </p>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
