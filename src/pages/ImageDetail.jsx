import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import api from "../services/api";
import "../styles/index.css";

const ImageDetail = ({ isSidebarOpen }) => {
  // Mengambil sessionId dari URL parameter
  const { sessionId } = useParams();

  // State untuk menyimpan daftar gambar
  const [images, setImages] = useState([]);

  // State untuk menyimpan pesan error
  const [error, setError] = useState("");

  // State untuk menandai apakah data sedang dimuat
  const [loading, setLoading] = useState(false);

  // State untuk menyimpan ID gambar yang sedang diedit
  const [editing, setEditing] = useState(null);

  // State untuk menyimpan prompt baru saat edit
  const [newPrompt, setNewPrompt] = useState("");

  // State untuk menandai apakah proses update sedang berjalan
  const [isUpdating, setIsUpdating] = useState(false);

  // State untuk menampilkan popup konfirmasi penghapusan
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  // State untuk menyimpan ID gambar yang akan dihapus
  const [imageToDelete, setImageToDelete] = useState(null);

  // Effect untuk memuat detail sesi saat komponen dimuat atau sessionId berubah
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

  // Fungsi untuk memuat detail sesi dari API
  const loadSessionDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Mengambil detail sesi dari API
      const response = await api.get(`/text-to-image/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Menyimpan daftar gambar ke state
      setImages(response.data.images);
    } catch (err) {
      // Menampilkan pesan error jika gagal memuat data
      setError(err.response?.data?.error || "Failed to load session details.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus gambar
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      // Mengirim permintaan DELETE ke API untuk menghapus gambar
      await api.delete(`/text-to-image/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Menghapus gambar dari state
      const updatedImages = images.filter((img) => img.id !== id);
      setImages(updatedImages);

      // Redirect ke dashboard jika tidak ada gambar tersisa
      if (updatedImages.length === 0) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      // Menampilkan pesan error jika gagal menghapus
      setError("Failed to delete the image.");
    } finally {
      setDeletePopupVisible(false);
    }
  };

  // Fungsi untuk mengedit prompt gambar
  const handleEdit = async (id) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");

      // Mengirim permintaan PUT ke API untuk mengupdate prompt
      const response = await api.put(
        `/text-to-image/update/${id}`,
        { prompt: newPrompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Mengupdate gambar di state dengan data baru
      setImages(
        images.map((img) =>
          img.id === id ? { ...img, prompt: newPrompt, image_url: response.data.imageUrl } : img
        )
      );

      // Menghentikan mode edit
      setEditing(null);
      setNewPrompt("");
    } catch (err) {
      // Menampilkan pesan error jika gagal mengupdate
      setError("Failed to update the prompt.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`image-history ${isSidebarOpen ? "open" : "closed"}`}
    style={{
      "--sidebar-offset": isSidebarOpen ? "130px" : "0px", // Sesuaikan dengan lebar sidebar
    }}
  >
      {/* Judul halaman */}
      <h1 className="img-detail-title">IMAGE DETAILS</h1>

      {/* Menampilkan pesan error jika ada */}
      {error && <p className="img-detail-error">{error}</p>}

      {/* Menampilkan daftar gambar jika tidak ada error */}
      {!error && (
        <div className="img-detail-grid">
          {images.map((image) => (
            <div key={image.id} className="img-detail-item">
              <div className="img-detail-content">
                {/* Bagian kiri: Avatar dan gambar */}
                <div className="img-detail-left">
                  <FaUserCircle className="img-detail-avatar" />
                  <img src={image.image_url} alt="Generated" className="img-detail-image" />
                </div>

                {/* Bagian kanan: Prompt dan avatar */}
                <div className="img-detail-right">
                  <p className="img-detail-prompt">{image.prompt}</p>
                  <FaUserCircle className="img-detail-avatar" />
                </div>
              </div>

              {/* Tombol untuk edit dan delete */}
              <div className="img-detail-button-group">
                {editing === image.id ? (
                  // Mode edit: Input dan tombol save/cancel
                  <>
                    <input
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      className="img-detail-input"
                      placeholder="Edit prompt"
                    />
                    <button
                      onClick={() => handleEdit(image.id)}
                      className={`img-detail-button save ${isUpdating ? "loading" : ""}`}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving" : "Save"}
                    </button>
                    <button onClick={() => setEditing(null)} className="img-detail-button cancel">
                      Cancel
                    </button>
                  </>
                ) : (
                  // Mode normal: Tombol edit dan delete
                  <>
                    <button
                      onClick={() => {
                        setEditing(image.id);
                        setNewPrompt(image.prompt);
                      }}
                      className="img-detail-button edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setImageToDelete(image.id);
                        setDeletePopupVisible(true);
                      }}
                      className="img-detail-button delete"
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

      {/* Popup konfirmasi penghapusan */}
      {deletePopupVisible && (
  <>
    <div className="overlay" onClick={() => setDeletePopupVisible(false)} />
    <div className="delete-popup">
      <div className="popup-content">
        <p>Are you sure you want to delete</p>
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
  </>
)}
    </div>
  );
};

export default ImageDetail;