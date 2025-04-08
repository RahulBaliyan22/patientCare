import io from "socket.io-client";

export const socket = io("https://patientcare-2.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
})