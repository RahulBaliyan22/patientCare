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
        <button
  style={{
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s ease",
    display: "flex",              
    justifyContent: "center",     
    alignItems: "center",         
    padding: 0                    
  }}
  onClick={onClose}
>
  x
</button>

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
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
