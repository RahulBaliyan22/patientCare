import io from "socket.io-client";

const heartSocket = io('https://patientcare-2.onrender.com/vital-heart-rate',{
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
})

const spo2Socket = io('https://patientcare-2.onrender.com/vital-spo2',{
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
})


const bodyTemp = io('https://patientcare-2.onrender.com/vital-body-temp',{
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
})



const connectTOBack = io('https://patientcare-2.onrender.com/frontend',{
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
})

export  {heartSocket,spo2Socket,bodyTemp,connectTOBack};