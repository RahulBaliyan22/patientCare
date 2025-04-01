import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import "./Chat.css";

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chat-wrapper">
      {isOpen && <ChatSidebar onClose={() => setIsOpen(false)} />}
      <button className="chat-wrapper__button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatbotButton;
