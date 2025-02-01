import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaSort,
  FaEdit,
  FaTrash,
  FaClock,
  FaSortAlphaDown,
  FaSortNumericDown,
  FaImage,
} from "react-icons/fa";
import "../styles/index.css";

const ImageHistory = ({ isSidebarOpen }) => {
  // State untuk menyimpan daftar sesi
  const [sessions, setSessions] = useState([]);

  // State untuk menyimpan sesi yang sudah difilter
  const [filteredSessions, setFilteredSessions] = useState([]);

  // State untuk menyimpan query pencarian
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk menyimpan opsi pengurutan
  const [sortOption, setSortOption] = useState("newest");

  // State untuk menyimpan ID sesi yang sedang diedit
  const [editingSessionId, setEditingSessionId] = useState(null);

  // State untuk menyimpan nama baru saat edit
  const [newName, setNewName] = useState("");

  // State untuk menandai apakah data sedang dimuat
  const [loading, setLoading] = useState(false);

  // State untuk menyimpan pesan error
  const [error, setError] = useState("");

  // State untuk menampilkan popup pengurutan
  const [sortPopupVisible, setSortPopupVisible] = useState(false);

  // State untuk menampilkan popup penghapusan
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  // State untuk menyimpan ID sesi yang akan dihapus
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // State untuk menandai jika tidak ada riwayat sesi
  const [noHistory, setNoHistory] = useState(false);

  // Hook untuk navigasi antar halaman
  const navigate = useNavigate();

  // Effect untuk memuat daftar sesi saat komponen dimuat
  useEffect(() => {
    loadSessions();
  }, []);

    useEffect(() => {
      const popup = document.querySelector(".delete-popup");
      if (popup) {
        const offset = isSidebarOpen ? 130 : 0; // Sesuaikan dengan lebar sidebar
        popup.style.left = `calc(50% + ${offset}px)`;
      }
    }, [isSidebarOpen, deletePopupVisible]);

  // Effect untuk menerapkan filter dan pengurutan saat sessions, searchQuery, atau sortOption berubah
  useEffect(() => {
    applyFilters();
  }, [sessions, searchQuery, sortOption]);

  // Fungsi untuk memuat daftar sesi dari API
  const loadSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Mengambil daftar sesi dari API
      const response = await api.get("/text-to-image/image-sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Menyimpan daftar sesi ke state
      setSessions(response.data);

      // Menandai jika tidak ada riwayat sesi
      setNoHistory(response.data.length === 0);
    } catch (err) {
      // Menampilkan pesan error jika gagal memuat data
      setError(err.response?.data?.error || "Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menerapkan filter dan pengurutan
  const applyFilters = () => {
    // Filter sesi berdasarkan query pencarian
    let filtered = sessions.filter((session) =>
      session.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Mengurutkan sesi berdasarkan opsi yang dipilih
    filtered.sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOption === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    // Menyimpan hasil filter dan pengurutan ke state
    setFilteredSessions(filtered);
  };

  // Fungsi untuk mengganti nama sesi
  const handleRename = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");

      // Mengirim permintaan PUT ke API untuk mengganti nama sesi
      await api.put(
        `/text-to-image/rename-session/${sessionId}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Menghentikan mode edit dan memuat ulang daftar sesi
      setEditingSessionId(null);
      setNewName("");
      loadSessions();
    } catch (err) {
      // Menampilkan pesan error jika gagal mengganti nama
      setError(err.response?.data?.error || "Failed to rename session.");
    }
  };

  // Fungsi untuk menghapus sesi
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      // Mengirim permintaan DELETE ke API untuk menghapus sesi
      await api.delete(`/text-to-image/delete-session/${sessionToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Menutup popup penghapusan dan memuat ulang daftar sesi
      setDeletePopupVisible(false);
      setSessionToDelete(null);
      loadSessions();
    } catch (err) {
      // Menampilkan pesan error jika gagal menghapus
      setError(err.response?.data?.error || "Failed to delete session.");
    }
  };

  return (
    <div className={`image-history ${isSidebarOpen ? "open" : "closed"}`}
    style={{
      "--sidebar-offset": isSidebarOpen ? "130px" : "0px", // Sesuaikan dengan lebar sidebar
    }}
  >
      {/* Header */}
      <div className="history-header">
        <h1>IMAGE HISTORY</h1>

        {/* Menampilkan pesan error jika ada */}
        {error && <div className="error-message">{error}</div>}

        {/* Container untuk pencarian dan pengurutan */}
        <div className="search-sort-container">
          {/* Input pencarian */}
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tombol pengurutan */}
          <button
            className="sort-button"
            onClick={() => setSortPopupVisible(!sortPopupVisible)}
          >
            Sort <FaSort />
          </button>

          {/* Popup opsi pengurutan */}
          {sortPopupVisible && (
            <div className="sort-popup"
              style={{
                top: "100%", /* Letakkan di bawah tombol */
                right: "0px", /* Geser ke kiri sedikit */
                marginTop: "21px",
              }}>
              <button
                onClick={() => {
                  setSortOption("newest");
                  setSortPopupVisible(false);
                }}
              >
                <FaSortNumericDown className="sort-icon" /> Newest
              </button>
              <button
                onClick={() => {
                  setSortOption("oldest");
                  setSortPopupVisible(false);
                }}
              >
                <FaClock className="sort-icon" /> Oldest
              </button>
              <button
                onClick={() => {
                  setSortOption("name");
                  setSortPopupVisible(false);
                }}
              >
                <FaSortAlphaDown className="sort-icon" /> By Name
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Daftar riwayat sesi */}
      <div className="history-list">
        {loading ? (
          <div className="loading-message"></div>
        ) : noHistory ? (
          <div className="no-history">
            No history found. Start creating sessions to see them here!
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div key={session.id} className="history-item">
              {/* Bagian atas: Nama sesi dan ikon */}
              <div
                className="history-top"
                onClick={() => navigate(`/image-detail/${session.id}`)}
              >
                {editingSessionId === session.id ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <>
                    <FaImage className="history-image-icon" />
                    <span className="history-name" title={session.name}>{session.name}</span>
                  </>
                )}
              </div>

              {/* Bagian bawah: Tanggal pembuatan sesi */}
              <div className="history-bottom">
                <FaClock className="history-date-icon" />
                <span>{new Date(session.created_at).toLocaleString()}</span>
              </div>

              {/* Tombol aksi: Edit dan Delete */}
              <div className="actions">
                {editingSessionId === session.id ? (
                  <>
                    <button
                      className="save-btn"
                      onClick={() => handleRename(session.id)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingSessionId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <FaEdit
                      className="icon edit"
                      onClick={() => {
                        setEditingSessionId(session.id);
                        setNewName(session.name);
                      }}
                    />
                    <FaTrash
                      className="icon delete"
                      onClick={() => {
                        setDeletePopupVisible(true);
                        setSessionToDelete(session.id);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup konfirmasi penghapusan */}
      {deletePopupVisible && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete this session?</p>
            <div className="popup-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeletePopupVisible(false)}
              >
                Cancel
              </button>

              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageHistory;