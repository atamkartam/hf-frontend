import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fungsi untuk menangani proses login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mengirim permintaan login ke server
      const response = await api.post("/auth/login", { email, password });

      // Menyimpan token di localStorage (perhatikan bahwa ini tidak aman untuk produksi)
      localStorage.setItem("token", response.data.token);

      // Mengarahkan pengguna ke dashboard setelah login berhasil
      navigate("/dashboard");
    } catch (err) {
      // Menampilkan pesan error jika login gagal
      setError(err.response?.data?.message || "Login gagal. Coba lagi.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please login to your account</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-form-group">
          <label htmlFor="email" className="bold-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="login-form-group">
          <label htmlFor="password" className="bold-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <p className="login-forgot-password">
            <a href="/forgot-password">Forgot your password?</a>
          </p>
          {error && <p className="login-error-message">{error}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <p className="login-footer">
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;