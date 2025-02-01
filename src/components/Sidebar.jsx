import React from "react";
import { Link, useLocation } from "react-router-dom"; // Mengimpor useLocation untuk mendapatkan path URL saat ini
import {
  AiOutlineDashboard,
  AiOutlineFileText,
  AiOutlineHistory,
  AiOutlinePicture,
} from "react-icons/ai";
import "../styles/index.css";

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation(); // Mendapatkan path URL saat ini

  // Fungsi untuk mengecek apakah path saat ini aktif
  const isActive = (path) => location.pathname === path;

  return (
    <div className={`hf-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      {/* Menampilkan judul sidebar jika sidebar terbuka */}
      {isSidebarOpen && <h2>Hugging Face</h2>}

      {/* Daftar menu sidebar */}
      <ul className="hf-sidebar__list">
        {/* Menu Dashboard */}
        <li>
          <Link
            to="/dashboard"
            className={`hf-sidebar__link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <AiOutlineDashboard className="hf-sidebar__link-icon" />
            {/* Menampilkan teks menu jika sidebar terbuka */}
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
        </li>

        {/* Menu Text to Image */}
        <li>
          <Link
            to="/text-to-image"
            className={`hf-sidebar__link ${isActive("/text-to-image") ? "active" : ""}`}
          >
            <AiOutlinePicture className="hf-sidebar__link-icon" />
            {isSidebarOpen && <span>Text to Image</span>}
          </Link>
        </li>

        {/* Menu Image History */}
        <li>
          <Link
            to="/image-history"
            className={`hf-sidebar__link ${isActive("/image-history") ? "active" : ""}`}
          >
            <AiOutlineHistory className="hf-sidebar__link-icon" />
            {isSidebarOpen && <span>Image History</span>}
          </Link>
        </li>

        {/* Menu Text Generation */}
        <li>
          <Link
            to="/text-generation"
            className={`hf-sidebar__link ${isActive("/text-generation") ? "active" : ""}`}
          >
            <AiOutlineFileText className="hf-sidebar__link-icon" />
            {isSidebarOpen && <span>Text Generation</span>}
          </Link>
        </li>

        {/* Menu Text History */}
        <li>
          <Link
            to="/text-history"
            className={`hf-sidebar__link ${isActive("/text-history") ? "active" : ""}`}
          >
            <AiOutlineHistory className="hf-sidebar__link-icon" />
            {isSidebarOpen && <span>Text History</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;