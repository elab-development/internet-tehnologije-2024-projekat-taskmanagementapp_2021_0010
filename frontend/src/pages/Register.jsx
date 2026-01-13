import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    try {


  const res = await axios.post("/register", {
    name,
    email,
    phone,
    password,
    password_confirmation,
  });

  alert(" Registration successful!");
  navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
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
              name="name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
  <input
    type="text"
    name="phone"
    placeholder="Phone number (optional)"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
  />
</div>
          <div className="input-group">
            <input
              type="password"
              name="password_confirmation"
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