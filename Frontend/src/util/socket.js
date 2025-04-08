import io from "socket.io-client";

// 🔌 Create socket instances with autoConnect disabled
const patientsocket = io("https://patientcare-2.onrender.com/chat-patient", {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
});

const adminsocket = io("https://patientcare-2.onrender.com/chat-admin", {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
});

const guestsocket = io("https://patientcare-2.onrender.com/chat-guest", {
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
});

// 🔌 Connect socket based on role
export const connectSocketByRole = (role) => {
  disconnectAllSockets(); // Ensure all previous sockets are closed

  switch (role) {
    case "admin":
      if (!adminsocket.connected) return adminsocket.connect();
      break;
    case "patient":
      if (!patientsocket.connected) return patientsocket.connect();
      break;
    default:
      if (!guestsocket.connected) return guestsocket.connect();
      break;
  }
};


export const checkConnectSocketByRole = (role) => {
  switch (role) {
    case "admin":
      return adminsocket?.connected ?? false;
    case "patient":
      return patientsocket?.connected ?? false;
    default:
      return guestsocket?.connected ?? false;
  }
};


// 🔌 Disconnect socket based on role
export const disconnectSocketByRole = (role) => {
  switch (role) {
    case "admin":
      return adminsocket.disconnect();
    case "patient":
      return patientsocket.disconnect();
    default:
      return guestsocket.disconnect();
  }
};

// 🔌 Disconnect all sockets (optional use case)
export const disconnectAllSockets = () => {
  if (patientsocket?.connected) patientsocket.disconnect();
  if (adminsocket?.connected) adminsocket.disconnect();
  if (guestsocket?.connected) guestsocket.disconnect();
};



// 👉 Export sockets in case you need to listen/send messages
export { patientsocket, adminsocket, guestsocket };
