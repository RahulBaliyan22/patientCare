const {authorizeRole} = require('../middleware')

 heartInfo= (io)=>{
  const vitalsNamespace = io.of("/vital-heart-rate");

  
  vitalsNamespace.use(authorizeRole("patient"))

  vitalsNamespace.on("connection",(socket)=>{
    console.log("heart connected")
    socket.on("start-machine",()=>{
       
    })

    socket.on("disconnect", () => {
      console.log("🔴user disconnected");
    });
  })
}

spoInfo= (io)=>{
  const vitalsNamespace = io.of("/vital-spo2");

  
  vitalsNamespace.use(authorizeRole("patient"))

  vitalsNamespace.on("connection",(socket)=>{
    console.log("spo2 connected")
    socket.on("start-machine",()=>{

    })

    socket.on("disconnect", () => {
      console.log("🔴user disconnected");
    });
  })
}

tempInfo= (io)=>{
  const vitalsNamespace = io.of("/vital-body-temp");

  
  vitalsNamespace.use(authorizeRole("patient"))

  vitalsNamespace.on("connection",(socket)=>{
    console.log("body temp connected")
    socket.on("start-machine",()=>{

    })
    socket.on("disconnect", () => {
      console.log("🔴user disconnected");
    });
  })
}

module.exports = {heartInfo,tempInfo,spoInfo}