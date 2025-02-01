import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";
import api from "../services/api";

function ForgotPassword() {
  // State untuk menyimpan email yang dimasukkan pengguna
  const [email, setEmail] = useState("");

  // State untuk menyimpan pesan sukses atau error
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Hook untuk navigasi antar halaman
  const navigate = useNavigate();

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman saat form di-submit

    try {
      // Mengirim permintaan ke API untuk mengirim tautan reset password
      await api.post("/auth/forgot-password", { email });

      // Menampilkan pesan sukses dan menghapus pesan error jika ada
      setSuccess("A reset link has been sent to your email.");
      setError("");
    } catch (err) {
      // Menampilkan pesan error jika permintaan gagal
      setError("Failed to send reset link. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password__container">
        {/* Judul halaman */}
        <h2 className="forgot-password__title">Forgot Your Password?</h2>

        {/* Subjudul halaman */}
        <p className="forgot-password__subtitle">
          Enter your email address, and we’ll send you a reset link.
        </p>

        {/* Form untuk memasukkan email */}
        <form onSubmit={handleSubmit} className="forgot-password__form">
          <div className="forgot-password__form-group">
            <label htmlFor="password" className="bold-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="forgot-password__input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Mengupdate state email saat input berubah
              required // Wajib diisi
            />
          </div>

          {/* Menampilkan pesan error jika ada */}
          {error && <p className="forgot-password__error-message">{error}</p>}

          {/* Menampilkan pesan sukses jika ada */}
          {success && <p className="forgot-password__success-message">{success}</p>}

          {/* Tombol untuk mengirim tautan reset password */}
          <button type="submit" className="forgot-password__button">
            Send Reset Link
          </button>

          {/* Tombol untuk kembali ke halaman login */}
          <button
            type="button"
            className="forgot-password__back-button"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;