const express = require("express");
const bodyParser = require("body-parser");
const mqtt = require("mqtt");

const app = express();
app.use(bodyParser.json());

// HiveMQ Cloud settings
const options = {
  host: "91d4e16936c54687bcbae60a22ebf30c.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "hivemq.webclient.1759169920317", 
  password: "k>0cH9bv#6@Yg*3QXuFO"
};

const mqttClient = mqtt.connect(options);
const PLATE_TOPIC = "scann/plate";

let latestPlate = {};

mqttClient.on("connect", () => {
  console.log("✅ Connected to HiveMQ Cloud");
  mqttClient.subscribe(PLATE_TOPIC, (err) => {
    if (!err) console.log(`📡 Subscribed to ${PLATE_TOPIC}`);
  });
});

mqttClient.on("message", (topic, message,req,res) => {
  if (topic === PLATE_TOPIC) {
    try {
      const data = JSON.parse(message.toString());
      latestPlate = data;
      res.json({ success: true, data: latestPlate });
      //console.log("🚗 Plate Update:", latestPlate);
    } catch (err) {
      console.error("❌ Invalid plate data", err);
    }
  }
});

// REST endpoint
app.get("/plate", (req, res) => {
  res.json({ success: true, data: latestPlate });
});

app.listen(5000, () => console.log("🚀 Server running at http://localhost:5000"));
