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

const TextHistory = ({ isSidebarOpen }) => {
  // State untuk menyimpan sesi, sesi yang difilter, query pencarian, opsi pengurutan, dan lainnya
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortPopupVisible, setSortPopupVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [noHistory, setNoHistory] = useState(false); // State untuk kondisi "no history found"

  const navigate = useNavigate();

  // Effect untuk memuat sesi saat komponen di-mount
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

  // Effect untuk menerapkan filter saat sessions, searchQuery, atau sortOption berubah
  useEffect(() => {
    applyFilters();
  }, [sessions, searchQuery, sortOption]);

  // Fungsi untuk memuat sesi dari API
  const loadSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const response = await api.get("/text-generation/text-sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(response.data);
      setNoHistory(response.data.length === 0); // Cek apakah data kosong setelah load
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menerapkan filter dan pengurutan
  const applyFilters = () => {
    let filtered = sessions.filter((session) =>
      session.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOption === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    setFilteredSessions(filtered);
  };

  // Fungsi untuk mengubah nama sesi
  const handleRename = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      await api.put(
        `/text-generation/rename-session/${sessionId}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingSessionId(null);
      setNewName("");
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to rename session.");
    }
  };

  // Fungsi untuk menghapus sesi
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      await api.delete(`/text-generation/delete-session/${sessionToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletePopupVisible(false);
      setSessionToDelete(null);
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete session.");
    }
  };

  return (
    <div className={`image-history ${isSidebarOpen ? "open" : "closed"}`}
    style={{
      "--sidebar-offset": isSidebarOpen ? "130px" : "0px", // Sesuaikan dengan lebar sidebar
    }}
  >
      <div className="history-header">
        <h1>TEXT HISTORY</h1>
        {error && <div className="error-message">{error}</div>}

        <div className="search-sort-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="sort-button"
            onClick={() => setSortPopupVisible(!sortPopupVisible)}
          >
            Sort <FaSort />
          </button>

          {sortPopupVisible && (
            <div
              className="sort-popup"
              style={{
                top: "100%", /* Letakkan di bawah tombol */
                right: "0px", /* Geser ke kiri sedikit */
                marginTop: "21px",
              }}
            >
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
              <div
                className="history-top"
                onClick={() => navigate(`/text-detail/${session.id}`)}
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
                    <span className="history-name">{session.name}</span>
                  </>
                )}
              </div>

              <div className="history-bottom">
                <FaClock className="date-icon" />
                <span>{new Date(session.created_at).toLocaleString()}</span>
              </div>

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

export default TextHistory;