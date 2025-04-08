const {authorizeRole} = require('../middleware')

module.exports = (io)=>{
  const vitalsNamespace = io.of("/vitals");

  
  vitalsNamespace.use(authorizeRole("patient"))
  vitalsNamespace.on("connection",(socket)=>{



    socket.on("disconnect", () => {
      console.log("🔴user disconnected");
    });
  })
}