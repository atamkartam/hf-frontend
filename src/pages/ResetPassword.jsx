import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/index.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fungsi untuk menangani proses reset password
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mengirim permintaan reset password ke server
      await api.post("/auth/reset-password", { token, newPassword });

      // Menampilkan pesan sukses
      setSuccess("Password reset successful!");
      setError("");

      // Mengarahkan pengguna ke halaman login setelah beberapa detik
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      // Menampilkan pesan error jika reset password gagal
      setError("Failed to reset password. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2 className="reset-password-title">Reset Your Password</h2>
        <p className="reset-password-subtitle">Enter your new password below.</p>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="reset-password-form-group">
            <label htmlFor="password" className="bold-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="reset-password-error-message">{error}</p>}
          {success && (
            <>
              <p className="reset-password-success-message">{success}</p>
              <button
                className="reset-password-btn"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            </>
          )}
          <button type="submit" className="reset-password-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;