import { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import api from "../services/api";
import "../styles/index.css";

const TextGeneration = ({ isSidebarOpen }) => {
  // State untuk menyimpan prompt, loading status, chat history, dan sessionId
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionId, setSessionId] = useState(localStorage.getItem("text-generation-sessionId") || null);

  // Effect untuk membersihkan sessionId dari localStorage saat komponen di-unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem("text-generation-sessionId");
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
          "/text-generation",
          { prompt },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        currentSessionId = sessionResponse.data.sessionId;
        setSessionId(currentSessionId);
        localStorage.setItem("text-generation-sessionId", currentSessionId);
        response = sessionResponse;
      } else {
        // Jika sessionId sudah ada, gunakan sessionId tersebut
        response = await api.post(
          "/text-generation",
          { prompt, sessionId: currentSessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Tambahkan prompt dan hasil ke chat history
      const newEntry = { prompt, result: response.data.result };
      setChatHistory([...chatHistory, newEntry]);
      setPrompt("");
    } catch (err) {
      console.error("Error generating text:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`text-generation-container ${isSidebarOpen ? "open" : "closed"} ${chatHistory.length ? "filled" : "empty"}`}>
      {!chatHistory.length && <h1 className="text-generation-title">Let’s create something amazing!</h1>}

      <div className="text-generation-chat-layout">
        {chatHistory.map((entry, index) => (
          <div key={index} className="text-generation-chat-entry">
            {/* Pesan dari pengguna */}
            <div className="text-generation-chat-row user-message">
              <div className="text-generation-chat-bubble">{entry.prompt}</div>
              <FaUserCircle className="chat-icon user-icon" size={28} />
            </div>

            {/* Pesan dari AI */}
            <div className="text-generation-chat-row ai-message">
              <FaUserCircle className="chat-icon ai-icon" size={28} />
              <div className="text-generation-chat-bubble">{entry.result}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input box untuk mengirim prompt */}
      <div className="text-generation-input-box">
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

export default TextGeneration;