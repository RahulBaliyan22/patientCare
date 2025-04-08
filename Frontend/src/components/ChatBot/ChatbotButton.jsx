import React, { useEffect, useState, useContext, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import "./Chat.css";
import ChatContext from "../../util/chatContext";

const ChatbotButton = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const { chatUser } = useContext(ChatContext); // context provides { socket, role }

  useEffect(() => {
    if (chatUser?.socket) {
      console.log(`${chatUser.role}:`, JSON.stringify(chatUser.socket));

      chatUser.socket.connect();
    }
  }, [chatUser]);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="chat-wrapper">
      {isOpen  && (
        <ChatSidebar
          onClose={handleClose}
          socket={chatUser?.socket}
          role={chatUser?.role}
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
