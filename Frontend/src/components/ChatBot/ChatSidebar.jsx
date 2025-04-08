import React, { useState, useEffect } from "react";
import { socket } from "../../util/socket";
import "./Chat.css";

// Move socket initialization outside component to avoid reconnects on re-render


const ChatSidebar = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Listen for bot response
    socket.on("bot-response", (message) => {
      setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
    });

    // Listen for initial bot message when socket connects
    socket.on("bot-initial-response", (message) => {
      setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
    });

    return () => {
      socket.off("bot-response");
      socket.off("bot-initial-response");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      socket.emit("user-message", { message: input });
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
          <div
            key={i}
            className={`chat-wrapper__message ${
              msg.sender === "bot" ? "chat-wrapper__message--bot" : ""
            }`}
          >
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
        <button className="chat-wrapper__input__button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
