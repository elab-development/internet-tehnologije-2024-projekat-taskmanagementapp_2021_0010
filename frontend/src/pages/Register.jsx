import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      await api.post("/register", { name, email, password, password_confirmation });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={logo} alt="Logo" className="app-logo" />
        <h1 className="app-title">Task Management App</h1>
        <p className="welcome-text">Create an account</p>

        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm password"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="pink-btn login-btn">
            Register
          </button>
            <p className="auth-footer">
           Already have an account? <a href="/login">Login</a>
            </p>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
