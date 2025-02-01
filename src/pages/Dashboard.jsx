import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiImage } from "react-icons/fi";
import { MdOutlineTextFields } from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaMoon, FaSun } from "react-icons/fa";
import "../styles/index.css";

const Dashboard = ({ isSidebarOpen }) => {
  // State untuk mengelola dark mode
  const [darkMode, setDarkMode] = useState(false);

  // State untuk menyimpan pesan sapaan berdasarkan waktu
  const [greeting, setGreeting] = useState("");

  // Effect untuk mengatur pesan sapaan berdasarkan waktu
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning! ☀️");
    } else if (hours < 18) {
      setGreeting("Good Afternoon! 🌤️");
    } else {
      setGreeting("Good Evening! 🌙");
    }
  }, []);

  // Effect untuk memuat preferensi dark mode dari localStorage saat komponen dimuat
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  // Effect untuk menyimpan preferensi dark mode ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={`dashboard-wrapper ${isSidebarOpen ? "open" : "closed"} ${darkMode ? "dark-mode" : ""}`}>
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>{greeting}</h1>
        <p className="dashboard-subtitle">Enhance your creativity with our AI-powered tools!</p>
        <p className="dashboard-date">
          {/* Menampilkan tanggal dengan format yang ramah pengguna */}
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        {/* Tombol untuk mengaktifkan/menonaktifkan dark mode */}
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
        </button>
      </header>

      {/* Main Dashboard Content */}
      <main className="dashboard-content">
        <div className="dashboard-card-container">
          {/* Card untuk fitur Text to Image */}
          <div className="dashboard-card">
            <Link to="/text-to-image">
              <FiImage size={50} /> <span>Text to Image</span>
            </Link>
          </div>

          {/* Card untuk fitur Image History */}
          <div className="dashboard-card">
            <Link to="/image-history">
              <HiOutlineClipboardList size={50} /> <span>Image History</span>
            </Link>
          </div>

          {/* Card untuk fitur Text Generation */}
          <div className="dashboard-card">
            <Link to="/text-generation">
              <MdOutlineTextFields size={50} /> <span>Generate Text</span>
            </Link>
          </div>

          {/* Card untuk fitur Text History */}
          <div className="dashboard-card">
            <Link to="/text-history">
              <HiOutlineClipboardList size={50} /> <span>Text History</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;