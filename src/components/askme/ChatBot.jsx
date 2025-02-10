import React, { useState } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "/config";
import "./ChatBot.css";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function ChatBot() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleUserInput = (e) => setUserInput(e.target.value);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setResponse((prevResponse) => [
      ...prevResponse,
      { type: "user", message: userMessage }
    ]);
    setUserInput("");

    const res = await generateContent(userMessage);
    setResponse((prevResponse) => [
      ...prevResponse,
      { type: "bot", message: res }
    ]);
  };

  const generateContent = async (prompt) => {
    const result = await model.generateContent(prompt);
    if (
      result &&
      result.response &&
      result.response.candidates &&
      result.response.candidates.length > 0 &&
      result.response.candidates[0].content.parts.length > 0
    ) {
      return result.response.candidates[0].content.parts[0].text;
    }
    return "No valid response received.";
  };

  return (
    <>
      <div className={`chatbot-container ${isChatOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          Chatbot
          <button onClick={toggleChat}>
            <IoClose />
          </button>
        </div>
        <div className="chatbot-body">
          {response.map((msg, index) => (
            <div key={index} className="chatbot-message-container">
              <div className={`chatbot-message ${msg.type}`}>
                <ReactMarkdown>{msg.message}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <div className="chatbot-footer">
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            placeholder="Type a message..."
            className="chatbot-input"
          />
          <button onClick={handleSubmit} className="chatbot-send-button">
            <IoSend />
          </button>
        </div>
      </div>

      <button className="chatbot-floating-button" onClick={toggleChat}>
        💬
      </button>
    </>
  );
}
