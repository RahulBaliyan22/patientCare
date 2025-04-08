import React, { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import { socket } from "../../util/socket";
import "./Chat.css";

const ChatbotButton = () => {
   const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(()=>{

    socket.on("bot-initial-response", (message) => {
          setIsOpen(true);
          setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
          
        });


        return ()=>{
           socket.off("bot-initial-response");
        }
  },[])

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
