import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/index.css";
import { FaUserCircle } from "react-icons/fa";

const TextDetail = ({ isSidebarOpen }) => {
  const { sessionId } = useParams();
  const [texts, setTexts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newPrompt, setNewPrompt] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadSessionDetails();
  }, [sessionId]);

    useEffect(() => {
      const popup = document.querySelector(".delete-popup");
      if (popup) {
        const offset = isSidebarOpen ? 130 : 0; // Sesuaikan dengan lebar sidebar
        popup.style.left = `calc(50% + ${offset}px)`;
      }
    }, [isSidebarOpen, deletePopupVisible]);

  const loadSessionDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const response = await api.get(`/text-generation/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTexts(response.data.texts);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load session details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      await api.delete(`/text-generation/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedTexts = texts.filter((text) => text.id !== deleteId);
      setTexts(updatedTexts);
      setDeletePopupVisible(false);

      if (updatedTexts.length === 0) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Failed to delete the text.");
    }
  };

  const handleEdit = async (id) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const response = await api.put(
        `/text-generation/update/${id}`,
        { prompt: newPrompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTexts(
        texts.map((text) =>
          text.id === id ? { ...text, prompt: newPrompt, result: response.data.newResult } : text
        )
      );
      setEditing(null);
      setNewPrompt("");
    } catch (err) {
      setError("Failed to update the prompt.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`text-detail-container ${isSidebarOpen ? "open" : "closed"}`}
    style={{
      "--sidebar-offset": isSidebarOpen ? "130px" : "0px", // Sesuaikan dengan lebar sidebar
    }}
  >
      <h1 className="text-detail-title">TEXT DETAILS</h1>
      {error && <p className="text-detail-error">{error}</p>}
      {!error && (
        <div className="text-detail-list">
          {texts.map((text) => (
            <div key={text.id} className="text-detail-item">
              <div className="text-detail-content">
                <div className="text-detail-right">
                  <p className="text-detail-prompt">{text.prompt}</p>
                  <FaUserCircle className="text-detail-avatar" />
                </div>
                <div className="text-detail-left">
                  <FaUserCircle className="text-detail-avatar" />
                  <p className="text-detail-result">{text.result}</p>
                </div>
              </div>
              <div className="text-detail-button-group">
                {editing === text.id ? (
                  <>
                    <input
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      className="text-detail-input"
                      placeholder="Edit prompt"
                    />
                    <button
                      onClick={() => handleEdit(text.id)}
                      className={`text-detail-button save ${isUpdating ? "loading" : ""}`}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving" : "Save"}
                    </button>
                    <button onClick={() => setEditing(null)} className="text-detail-button cancel">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditing(text.id);
                        setNewPrompt(text.prompt);
                      }}
                      className="text-detail-button edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletePopupVisible(true);
                        setDeleteId(text.id);
                      }}
                      className="text-detail-button delete"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {deletePopupVisible && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete?</p>
            <div className="popup-actions">
              <button className="cancel-btn" onClick={() => setDeletePopupVisible(false)}>
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

export default TextDetail;
