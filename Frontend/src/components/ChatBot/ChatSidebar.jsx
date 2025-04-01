import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Chat.css";

const socket = io("wss://patientcare-2.onrender.com"); // Adjust URL to your backend

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
    <div className="chat-wrapper__sidebar">
      <div className="chat-wrapper__header">
        <h3>Chatbot</h3>
        
      </div>
      <div className="chat-wrapper__messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-wrapper__message ${msg.sender === "bot" ? "chat-wrapper__message--bot" : ""}`}>
            <div className="chat-wrapper__message__content">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-wrapper__input">
        <input
          className="chat-wrapper__input__field"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="chat-wrapper__input__button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatSidebar;
