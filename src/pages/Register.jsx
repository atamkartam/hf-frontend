import React, { useState } from "react";
import "../styles/index.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fungsi untuk menangani proses registrasi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulasi API call untuk registrasi
      // Ganti dengan `await api.post` jika API sudah disiapkan
      console.log("Submitted:", { name, email, password });

      // Menampilkan pesan sukses
      setSuccess("Registration successful! Please check your email for verification.");
      setError("");
    } catch (err) {
      // Menampilkan pesan error jika registrasi gagal
      setError("Registration failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-card__title">Create Your Account</h2>
          <p className="register-card__subtitle">Join us and enjoy exclusive benefits!</p>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-form__group">
              <label className="register-form__label">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="register-form__input"
                required
              />
            </div>
            <div className="register-form__group">
              <label className="register-form__label">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register-form__input"
                required
              />
            </div>
            <div className="register-form__group">
              <label className="register-form__label">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="register-form__input"
                required
              />
            </div>
            <button type="submit" className="register-form__button">
              Register
            </button>
          </form>
          {error && <p className="register-form__error">{error}</p>}
          {success && <p className="register-form__success">{success}</p>}
          <p className="register-card__link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;