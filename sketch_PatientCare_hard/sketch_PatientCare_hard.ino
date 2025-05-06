#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <Adafruit_MLX90614.h>

// WiFi credentials
const char* ssid = "wifissid";
const char* password = "wifipassword";

// AWS IoT Core settings
const char* mqtt_server = "your aws iot server"; 
const int mqtt_port = 8883; //default port
const char* thingName = "yourThingName"; 

WiFiClientSecure net;
PubSubClient client(net);


MAX30105 particleSensor;
Adafruit_MLX90614 mlx = Adafruit_MLX90614();


// AWS IoT Certificates
const char* certificate = \
"-----BEGIN CERTIFICATE-----\n" \
"-----END CERTIFICATE-----\n";

const char* private_key = \
"-----BEGIN RSA PRIVATE KEY-----\n" \
"-----END RSA PRIVATE KEY-----\n";

const char* root_ca = \
"-----BEGIN CERTIFICATE-----\n"
"-----END CERTIFICATE-----\n";

// Connect to WiFi
void connectWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected!");
}

float calculateSpO2(float redAC, float redDC, float irAC, float irDC) {
  float R = (redAC / redDC) / (irAC / irDC);
  float spo2 = 110.0 - 25.0 * R; // Empirical formula
  if (spo2 > 100) spo2 = 100;
  if (spo2 < 70) spo2 = 70;
  return spo2;
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("\n📥 Message arrived on topic: ");
  Serial.println(topic);

  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.println("📦 Payload: " + message);
  unsigned long lastBeat = 0;
  
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, message);

  String type = "";
  String socketId = "";

  if (!error) {
    
    if (doc.containsKey("type")) {
      type = doc["type"].as<String>();
    }
    if (doc.containsKey("socketId")) {
      socketId = doc["socketId"].as<String>();
    }
  } else {
    
    type = message;
  }

  if (type == "heart") {
  unsigned long t0 = 0, t1 = 0;
  long irValue = 0;
  unsigned long startTime = millis();
  
  // Wait for valid IR signal
  while (millis() - startTime < 5000) {
    irValue = particleSensor.getIR();
    Serial.println(irValue);
    if (irValue > 20000) break;
    delay(50);
  }

  if (irValue < 20000) {
    String errorData = "{\"type\": \"heart\", \"error\": \"Finger Not Detected\", \"socketId\": \"" + socketId + "\"}";
    publishError(errorData);
    return;
  }

  // Measure two heartbeats for accurate BPM
  Serial.println("🔍 Waiting for two heartbeats...");
  while (true) {
    irValue = particleSensor.getIR();
    if (checkForBeat(irValue)) {
      if (t0 == 0) {
        t0 = millis();  // First beat
        Serial.println("❤️ First beat detected");
        delay(20); // Debounce
      } else {
        t1 = millis();  // Second beat
        Serial.println("❤️ Second beat detected");
        break;
      }
    }
    delay(10);
    if (millis() - t0 > 10000 && t0 != 0) break;  // Timeout after 10s from first beat
  }

  if (t0 != 0 && t1 != 0) {
    float bpm = 60.0 / ((t1 - t0) / 1000.0);
    String heartJson = "{\"type\": \"heart\", \"value\": " + String(bpm, 1) +
                       ", \"unit\": \"bpm\", \"socketId\": \"" + socketId + "\"}";
    publishSensorData(heartJson);
  } else {
    String errorData = "{\"type\": \"heart\", \"error\": \"No consistent heartbeat detected\", \"socketId\": \"" + socketId + "\"}";
    publishError(errorData);
  }
}
  else if (type == "spo2") {
    long irValue = particleSensor.getIR();
     Serial.println(irValue);
    while (irValue<20000){
      irValue = particleSensor.getIR();
      Serial.println(irValue);
    }
if (irValue > 20000) {
      float redAC = 0, irAC = 0;
float redDC = 0, irDC = 0;
const int samples = 100;

for (int i = 0; i < samples; i++) {
  redDC += particleSensor.getRed();
  irDC += particleSensor.getIR();
  delay(5);
}
redDC /= samples;
irDC /= samples;

for (int i = 0; i < samples; i++) {
  float red = particleSensor.getRed();
  float ir = particleSensor.getIR();

  redAC += abs(red - redDC);
  irAC += abs(ir - irDC);
  delay(5);
}

float spo2Val = calculateSpO2(redAC, redDC, irAC, irDC);


String spo2Json = "{\"type\": \"spo2\", \"value\": " + String(spo2Val, 1) +
                  ", \"unit\": \"%\", \"socketId\": \"" + socketId + "\"}";
publishSensorData(spo2Json);
    }else{
      String errorData = "{\"type\": \"spo2\", \"error\": \"Finger Not Detected\", \"socketId\": \"" + socketId + "\"}";
      publishError(errorData);
    }

  } 
  else if (type == "temp") {
    float temp = mlx.readObjectTempC();
    String tempJson = "{\"type\": \"temp\", \"value\": " + String(temp, 2) +
                      ", \"unit\": \"C\", \"socketId\": \"" + socketId + "\"}";
    delay(1000);
    publishSensorData(tempJson);
  } 
  else if (type == "start") {
    Serial.println("✅ STARTING sensors...");
    publishMessage("started");
  } 
  else if (type == "stop") {
    Serial.println("🛑 STOPPING sensors...");
    publishMessage("stopped");
  } 
  else {
    Serial.println("⚠️ Unknown command!");
    publishMessage("Unknown command");
  }
}


// Connect to AWS IoT Core
void connectAWS() {
  Serial.print("Connecting to AWS IoT...");

  net.setCACert(root_ca);
  net.setCertificate(certificate);
  net.setPrivateKey(private_key);

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  while (!client.connected()) {
    Serial.print(".");

    // Try to connect to the AWS IoT broker using the Thing Name
    if (client.connect(thingName)) {
      Serial.println(" connected!");
      client.subscribe("patientcare/control");
      Serial.println("🔔 Subscribed to: patientcare/control");
    } else {
      Serial.print(" ❌ Connection failed, state: ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void publishMessage(String message){
  if (client.publish("patientcare/message", message.c_str())) {
    Serial.println("📤 Published: " + message);
  } else {
    Serial.println("❌ Publish failed.");
  }
}

// Publish data to AWS IoT Core (patientcare/data topic)
void publishSensorData(String data) {
  if (client.publish("patientcare/data", data.c_str())) {
    Serial.println("📤 Published: " + data);
  } else {
    Serial.println("❌ Publish failed.");
  }
}

void publishError(String data){
  if (client.publish("patientcare/Error", data.c_str())) {
    Serial.println("📤 Published: Finger not detected.");
  } else {
    Serial.println("❌ Publish failed.");
  }
}

void setup() {
  Serial.begin(115200);
  connectWiFi();
  connectAWS();

  Wire.begin(21, 22);

  // MAX30102 init
  if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
    Serial.println("MAX30102 not found. Retrying...");
    client.publish("patientcare/ErrorMes","sensors cannot be detected,for heart rate and spo2");
    while (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
      Serial.println("Retrying MAX30102...");
      delay(1000);
    }
  }

  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeIR(0x0A);

  // MLX90614 init
  if (!mlx.begin()) {
    Serial.println("MLX90614 not found. Retrying...");
    client.publish("patientcare/ErrorMes","sensors cannot be detected,for body temperature");
    while (!mlx.begin()) {
      Serial.println("Retrying MLX90614...");
      delay(1000);
    }
  }

  Serial.println("Setup complete.");
}


void loop() {
  if (!client.connected()) {
    connectAWS();
  }

  client.loop();  
}
