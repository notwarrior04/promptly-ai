import React, { useState } from "react";
import "../styles/chatbot.css";

const ChatWidget = () => {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt || !url) return;

    setLoading(true);
    setResponse("");

    const context = `Website: ${url}\nLanguage: ${language || "None"}`;

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, context }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Something went wrong. Please try again.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h1 className="app-title">Promptly AI Assistant</h1>

      <form className="chat-form" onSubmit={handleSubmit}>
        <label className="input-label">Website URL</label>
        <input
          type="url"
          placeholder="e.g. https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="chat-input"
        />

        <label className="input-label">Prompt</label>
        <textarea
          placeholder="Enter your prompt (e.g., summarize, translate...)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          className="chat-textarea"
        />

        <label className="input-label">Language to translate to (optional)</label>
        <input
          type="text"
          placeholder="e.g. Spanish, French..."
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="chat-input"
        />

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      {response && (
        <div className="response-container">
          <h2 className="response-title">Response</h2>
          <div className="chat-response">{response}</div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
