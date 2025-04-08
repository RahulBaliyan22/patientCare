import React, { useEffect, useState ,useContext} from "react";
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
import { AuthContext } from "../../main";

const ChatbotButton = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  // Determine role
  const role = user?.role || "guest";

  // Socket to use
  const socket =
    role === "admin" ? adminsocket :
    role === "patient" ? patientsocket :
    guestsocket;

  useEffect(() => {
    if (isLoggedIn && localStorage.getItem("user")) {
      const clientString = localStorage.getItem("user");
      const client = clientString ? JSON.parse(clientString) : null;
      setUser(client);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    connectSocketByRole(role);
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
