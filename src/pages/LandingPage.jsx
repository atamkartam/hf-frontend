import React, { useState, useEffect } from "react";
import api from "../services/api";

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil riwayat dari API
  const fetchHistory = async () => {
    try {
      const response = await api.get("/images");
      setHistory(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch history.");
    }
  };

  // Generate gambar baru
  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setError("");
    try {
      const response = await api.post("/images", { prompt });
      setHistory([response.data, ...history]);
      setPrompt("");
    } catch (err) {
      console.error(err);
      setError("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  // Hapus data
  const deleteImage = async (id) => {
    try {
      await api.delete(`/images/${id}`);
      setHistory(history.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete image.");
    }
  };

  // Update prompt dan gambar
  const updateImage = async (id, newPrompt) => {
    if (!newPrompt) return;

    setLoading(true);
    setError("");
    try {
      const response = await api.put(`/images/${id}`, { prompt: newPrompt });
      setHistory(
        history.map((item) =>
          item.id === id ? { ...item, prompt: newPrompt, imageUrl: response.data.imageUrl } : item
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Image Generation</h1>
      <div className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
          className="border rounded p-2 w-full"
        />
        <button
          onClick={generateImage}
          className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <h2 className="text-xl font-bold mb-2">History</h2>
        {history.map((item) => (
          <div key={item.id} className="border rounded p-4 mb-4">
            <img src={item.imageUrl} alt={item.prompt} className="w-full rounded mb-2" />
            <p className="text-sm text-gray-600 mb-2">Prompt: {item.prompt}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newPrompt = prompt(
                    "Enter new prompt:",
                    item.prompt
                  );
                  if (newPrompt) updateImage(item.id, newPrompt);
                }}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteImage(item.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGeneration;
