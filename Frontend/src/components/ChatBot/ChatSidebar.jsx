import React, { useState, useEffect, useContext } from "react";
import "./Chat.css";
import { AuthContext } from "../../main";
import ChatContext from "../../util/chatContext";

const ChatSidebar = ({ onClose, messages, setMessages, socket, role }) => {
  const [input, setInput] = useState("");
  const { isLoggedIn } = useContext(AuthContext);
  const { chatUser, setChatUser } = useContext(ChatContext);
  const [user, setUser] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    if (isLoggedIn && localStorage.getItem("user")) {
      const clientString = localStorage.getItem("user");
      const client = clientString ? JSON.parse(clientString) : null;
      setUser(client);
    }
  }, [isLoggedIn]);

  // Handle bot responses
  useEffect(() => {
    if (!role || !socket) return;
    console.log("Connecting to:", socket.nsp); // confirm namespace

    const responseEvent = `${role}:receive-response`;

    const handleResponse = (message) => {
      setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
    };

    socket.on(responseEvent, handleResponse);

    return () => {
      socket.off(responseEvent, handleResponse);
    };
  }, [role, socket, setMessages]);

  // Handle send message
  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      const emitEvent = `${role}:send-message`;
      socket.emit(emitEvent, input.trim());
      setInput("");
    }
  };

  return (
    <div className="chat-wrapper__sidebar">
      <div className="chat-wrapper__header">
        <h3>{role?.charAt(0).toUpperCase() + role?.slice(1)} Chat</h3>
        <button onClick={onClose}>×</button>
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
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="chat-wrapper__input__button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
