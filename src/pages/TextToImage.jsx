import { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import api from "../services/api";
import "../styles/index.css";

const TextToImage = ({ isSidebarOpen }) => {
  // State untuk menyimpan prompt, loading status, chat history, dan sessionId
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionId, setSessionId] = useState(localStorage.getItem("text-to-image-sessionId") || null);

  // Effect untuk membersihkan sessionId dari localStorage saat komponen di-unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem("text-to-image-sessionId");
    };
  }, []);

  // Fungsi untuk mengirim prompt dan mendapatkan respons dari API
  const handleGenerate = async () => {
    if (!prompt.trim()) return; // Jangan lakukan apa-apa jika prompt kosong
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      let currentSessionId = sessionId;
      let response;

      // Jika sessionId belum ada, buat session baru
      if (!sessionId) {
        const sessionResponse = await api.post(
          "/text-to-image",
          { prompt },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        currentSessionId = sessionResponse.data.sessionId;
        setSessionId(currentSessionId);
        localStorage.setItem("text-to-image-sessionId", currentSessionId);
        response = sessionResponse;
      } else {
        // Jika sessionId sudah ada, gunakan sessionId tersebut
        response = await api.post(
          "/text-to-image",
          { prompt, sessionId: currentSessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Tambahkan prompt dan hasil ke chat history
      const newEntry = { prompt, imageUrl: response.data.imageUrl };
      setChatHistory([...chatHistory, newEntry]);
      setPrompt("");
    } catch (err) {
      console.error("Error generating image:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`text-to-image-container ${isSidebarOpen ? "open" : "closed"} ${chatHistory.length ? "filled" : "empty"}`}>
      {!chatHistory.length && <h1 className="text-to-image-title">Generate Stunning AI Images!</h1>}

      <div className="text-to-image-chat-layout">
        {chatHistory.map((entry, index) => (
          <div key={index} className="text-to-image-chat-entry">
            {/* Pesan dari pengguna */}
            <div className="text-to-image-chat-row user-message">
              <div className="text-to-image-chat-bubble">{entry.prompt}</div>
              <FaUserCircle className="chat-icon user-icon" size={28} />
            </div>

            {/* Pesan dari AI */}
            <div className="text-to-image-chat-row ai-message">
              <FaUserCircle className="chat-icon ai-icon" size={28} />
              <div className="text-to-image-chat-bubble">
                <img src={entry.imageUrl} alt="Generated Result" className="text-to-image-result-image" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input box untuk mengirim prompt */}
      <div className="text-to-image-input-box">
        <textarea
          rows="1"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? "..." : <FiSend size={22} />}
        </button>
      </div>
    </div>
  );
};

export default TextToImage;