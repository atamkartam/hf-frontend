import React from "react";
import { AiOutlineLogout, AiOutlineMenu } from "react-icons/ai";
import "../styles/index.css";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const handleLogout = async () => {
    try {
      // Hapus token dari localStorage
      localStorage.removeItem("token");

      // Bersihkan cache dan data sensitif lainnya
      localStorage.clear();

      // Redirect ke halaman login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle error, misalnya tampilkan pesan ke pengguna
    }
  };

  return (
    <nav className={`hf-navbar ${isSidebarOpen ? "expanded" : "collapsed"}`}>
      <button onClick={toggleSidebar} className="hf-navbar__toggle">
        <AiOutlineMenu />
      </button>
      <h1 className="hf-navbar__title">Welcome Back!</h1>
      <button onClick={handleLogout} className="hf-navbar__button">
        <AiOutlineLogout />
        Logout
      </button>
    </nav>
  );
};

export default Navbar;