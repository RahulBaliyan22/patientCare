import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:8000"); // Adjust URL to your backend

const ChatSidebar = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("bot-response", (message) => {
      setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
    });

    return () => socket.off("bot-response");
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      socket.emit("user-message", input);
      setInput("");
    }
  };

  return (
    <div className="chat-sidebar">
      <div className="chat-header">
        <h3>Chatbot</h3>
        <button onClick={onClose}>X</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatSidebar;
