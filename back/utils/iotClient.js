const  awsIot = require('aws-iot-device-sdk');
const {value} = require('./sharedVitals')
const path = require('path');
const { waitingSockets } = require("./waitingSockets");
const device = awsIot.device({
    keyPath: "/etc/secrets/private.key",
    certPath: "/etc/secrets/cert.pem",
    caPath: "/etc/secrets/rootCA.pem",
    clientId: "device-01",
    host: "a29saz9pof92to-ats.iot.ap-south-1.amazonaws.com"
  });



device
    .on('connect', function() {
        console.log('connect');
        
        device.subscribe("patientcare/data"); 
        device.subscribe("patientcare/message");
    });

device.on("message", (topic, message) => {
  
if(topic === "patientcare/data"){
    const data = JSON.parse(message.toString());
    const { type, socketId, value } = data;
    
  // Check if the socketId exists in the waitingSockets
  if (waitingSockets[`${socketId}_${type}`]) {
    const socketData = waitingSockets[`${socketId}_${type}`];

    // If the requested type matches the waiting socket's type
    if (socketData.type === type) {
      // Emit the data to the correct socket
      socketData.socket.emit(type + "Data", value);

      // Clean up the socket from the list after emitting the data
      delete waitingSockets[`${socketId}_${type}`];
    } else {
      console.log(`Error: Socket requested ${socketData.type}, but received ${type}.`);
    }
  } else {
    console.log(`Error: Socket ${socketId} not found or already disconnected.`);
  }
}
});
device
    .on('close', function() {
        console.log('close');
    });
device
    .on('reconnect', function() {
        console.log('reconnect');
    });
device
    .on('offline', function() {
        console.log('offline');
    });
device
    .on('error', function(error) {
        console.log('error', error);
    });

module.exports = {device}