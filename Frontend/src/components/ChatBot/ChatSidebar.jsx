import React, { useState, useEffect } from "react";
import { socket } from "../../util/socket";
import "./Chat.css";

// Move socket initialization outside component to avoid reconnects on re-render

const ChatSidebar = ({ onClose, messages, setMessages }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleBotResponse = (message) => {
      setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
    };

    socket.on("bot-response", handleBotResponse);

    return () => {
      socket.off("bot-response", handleBotResponse);
    };
  }, [setMessages]);

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
        <button onClick={onClose} className="chat-wrapper__close-btn">✖</button>
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