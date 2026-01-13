import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Sprečava podrazumevano ponašanje pretraživača pri podnošenju forme (koje bi obično bilo osvežavanje stranice).
    setError("");

    try {
    // Šalje POST zahtev na endpoint /login na API serveru, prosleđujući unete vrednosti email i password kao telo zahteva. await čeka odgovor servera.
      const res = await axios.post("/login", { email, password });
      const user = res.data.user;

      // Čuvanje Podataka (Ako je uspešno):
      localStorage.setItem("token", res.data.token);
      //da bi lakse dosli do podataka usera bez ponovnog slanja zahteva
      //React stanje (useState, context) se briše kad se stranica osveži.
      localStorage.setItem("user", JSON.stringify(res.data.user));

     if (user.role === "admin") {
       navigate("/admin/dashboard");
        } else {
        navigate("/");
       }
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
              onChange={(e) => setEmail(e.target.value)}//onChange osigurava da se stanje ažurira pri svakom pritisku tastera (tzv. kontrolisana komponenta).
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