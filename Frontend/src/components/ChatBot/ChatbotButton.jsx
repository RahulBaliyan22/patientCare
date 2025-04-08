import React, { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import {
  patientsocket,
  adminsocket,
  guestsocket,
  connectSocketByRole,
  disconnectAllSockets,
} from "../../util/socket";
import "./Chat.css";

const ChatbotButton = ({ role = "guest" }) => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Determine which socket to use
  const socket =
    role === "admin"
      ? adminsocket
      : role === "patient"
      ? patientsocket
      : guestsocket;

  useEffect(() => {
    connectSocketByRole(role);
    return () => disconnectAllSockets();
  }, [role]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="chat-wrapper">
      {isOpen && (
        <ChatSidebar
          role={role}
          socket={socket}
          onClose={handleToggle}
          messages={messages}
          setMessages={setMessages}
        />
      )}
      <button className="chat-wrapper__button" onClick={handleToggle}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatbotButton;
