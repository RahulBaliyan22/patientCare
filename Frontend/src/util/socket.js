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
  disconnectAllSockets(); // Optional: Disconnect all before connecting one
  switch (role) {
    case "admin":
      return adminsocket.connect();
    case "patient":
      return patientsocket.connect();
    default:
      return guestsocket.connect();
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
  patientsocket.disconnect();
  adminsocket.disconnect();
  guestsocket.disconnect();
};


// 👉 Export sockets in case you need to listen/send messages
export { patientsocket, adminsocket, guestsocket };
