const  awsIot = require('aws-iot-device-sdk');
const {value} = require('./sharedVitals')
const path = require('path');

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
        device.publish("patientcare/control", JSON.stringify("start"));
        device.subscribe("patientcare/data"); 
        device.subscribe("patientcare/message");
    });
device.on("message", (topic, payload) => {
  console.log("📥 Message received from ESP:", topic, payload.toString());
  if(topic==="patientcare/data"){
      const data = JSON.parse(payload.toString());

      // Store to shared value object
      if (data.type === "heart") {
        value.heart = data.value;
      } else if (data.type === "spo2") {
        value.spo2 = data.value;
      } else if (data.type === "temp") {
        value.temp = data.value;
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