import React, { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import { socket } from "../../util/socket";
import "./Chat.css";

const ChatbotButton = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleInitialResponse = (message) => {
      setIsOpen(true);
      setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
    };

    // Listen only once for initial message
    socket.once("bot-initial-response", handleInitialResponse);

    return () => {
      socket.off("bot-initial-response", handleInitialResponse);
    };
  }, []);

  return (
    <div className="chat-wrapper">
      {isOpen && (
        <ChatSidebar
          onClose={() => setIsOpen(false)}
          messages={messages}
          setMessages={setMessages}
        />
      )}
      <button
        className="chat-wrapper__button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatbotButton;
