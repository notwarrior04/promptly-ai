import React, { useState, useEffect, useRef } from "react";
import "../styles/chatbot.css";
import { FaMicrophone, FaVolumeUp } from "react-icons/fa";

const ChatWidget = () => {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // 🎤 Voice recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt((prev) => prev + " " + transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // 🗣️ Load voices once
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  // 🌍 Detect language from text
  const detectLanguage = (text) => {
    if (/[\u0980-\u09FF]/.test(text)) return "bn"; // Bangla
    if (/[\u0900-\u097F]/.test(text)) return "hi";
    if (/[\u4e00-\u9fff]/.test(text)) return "zh";
    if (/[\u3040-\u30ff]/.test(text)) return "ja";
    if (/[\uac00-\ud7af]/.test(text)) return "ko";
    if (/[\u0600-\u06FF]/.test(text)) return "ar";
    if (/[\u0400-\u04FF]/.test(text)) return "ru";
    if (/[\u0e00-\u0e7f]/.test(text)) return "th";
    if (/[\u0100-\u017F]/.test(text)) return "pl";
    if (/[\u0370-\u03FF]/.test(text)) return "el";
    if (/[\u0590-\u05FF]/.test(text)) return "he";
    if (/[\u1780-\u17FF]/.test(text)) return "km";
    if (/[\u1000-\u109F]/.test(text)) return "my";
    if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
    if (/[\u0C00-\u0C7F]/.test(text)) return "te";
    if (/[\u0A80-\u0AFF]/.test(text)) return "gu";
    if (/[\u0A00-\u0A7F]/.test(text)) return "pa";
    if (/[\u0B00-\u0B7F]/.test(text)) return "or";
    if (/[\u0D00-\u0D7F]/.test(text)) return "ml";
    if (/[\u0D80-\u0DFF]/.test(text)) return "si";
    if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
    if (/[\u1E00-\u1EFF]/.test(text)) return "vi";
    return "en";
  };

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
      setResponse(data.response?.trim() || "No response received.");
    } catch (error) {
      console.error(error);
      setResponse("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const speakResponse = () => {
    const utterance = new SpeechSynthesisUtterance(response);
    const voices = window.speechSynthesis.getVoices();
    const lang = detectLanguage(response);
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(lang));
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang;
    }
    window.speechSynthesis.speak(utterance);
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

        <button
          type="button"
          className="mic-button"
          onClick={() => recognitionRef.current?.start()}
        >
          <FaMicrophone />
          {listening ? " Listening..." : " Speak"}
        </button>

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
          <button className="speak-button" onClick={speakResponse}>
            <FaVolumeUp /> Speak Response
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
