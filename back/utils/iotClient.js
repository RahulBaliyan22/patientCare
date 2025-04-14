const  awsIot = require('aws-iot-device-sdk');
const {value} = require('./sharedVitals')
const path = require('path');

const  clientEndpoint = "a29saz9pof92to-ats.iot.ap-south-1.amazonaws.com";
const  clientId = "device-01";
const  certificateFile = path.resolve(__dirname,"./certs/5881e00c1a20b48e63e0861fcf02f09d219da05dc8def45dbfcafa9a7209ce01-certificate.pem.crt");  // X.509 based certificate file
const  privateKeyFile = path.resolve(__dirname,"./certs/5881e00c1a20b48e63e0861fcf02f09d219da05dc8def45dbfcafa9a7209ce01-private.pem.key");   // PEM encoded private key file
const  caRootFile = path.resolve(__dirname,"./certs/AmazonRootCA1.pem");





const  device = awsIot.device({
        keyPath: privateKeyFile,
        certPath: certificateFile,
        caPath: caRootFile,
        clientId: clientId,
        host: clientEndpoint
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
        value.heart = data;
      } else if (data.type === "spo2") {
        value.spo2 = data;
      } else if (data.type === "temp") {
        value.temp = data;
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