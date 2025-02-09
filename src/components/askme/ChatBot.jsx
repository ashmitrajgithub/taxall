import React, { useState } from 'react';
import './ChatBot.css';
import { AiOutlineClose, AiOutlineSend, AiOutlineMessage } from 'react-icons/ai';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_DEEPSEEK_API_KEY}`, // Use environment variable for API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "deepseek-chat", // Replace with the correct model name
          messages: [
            {
              role: "user",
              content: input
            }
          ],
          max_tokens: 50 // Adjust as needed
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("DeepSeek response:", data);

      const botMessage = { sender: 'bot', text: data.choices[0].message.content };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Error communicating with DeepSeek:", error);
      const errorMessage = { sender: 'bot', text: "There was an error processing your request. Please try again." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>DeepSeek Assistant</span>
            <AiOutlineClose size={24} onClick={toggleChat} style={{ cursor: 'pointer' }} />
          </div>
          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="chatbot-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me a question..."
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send-button">
              <AiOutlineSend size={20} />
            </button>
          </form>
        </div>
      ) : (
        <div className="chatbot-floating-wrapper" onClick={toggleChat}>
          <button className="chatbot-floating-button">
            <AiOutlineMessage size={30} />
          </button>
          <div className="chatbot-tag">Ask me!</div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;