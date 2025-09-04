//import express from "express";
const express =  require('express');
const cors = require('cors');
const { sendToArduino, getLatestArduinoData, openGate, closeGate, onData } = require('./arduinoSerial');
require('./rfidBridge');
const apiRoutes = require('./routes');
const rfidRoutes = require('./routes/rfid');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/api/rfid', rfidRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);

app.get("/api/arduino", (req, res) => {
  res.json({ status: "ok", latest: getLatestArduinoData() });
});
app.post("/api/arduino", (req, res) => {
  const { message } = req.body;
  sendToArduino(message);
  res.json({ status: "ok", sent: message });
});
app.post('/api/gate/open', (req, res) => {
  openGate();
  res.json({ status: 'ok' });
});
app.post('/api/gate/close', (req, res) => {
  closeGate();
  res.json({ status: 'ok' });
});

// SSE stream for live Arduino data
app.get('/api/arduino/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  // send last value if exists
  const last = getLatestArduinoData();
  if (last) res.write(`data: ${JSON.stringify({ line: last })}\n\n`);

  const unsubscribe = onData((line) => {
    res.write(`data: ${JSON.stringify({ line })}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
    res.end();
  });
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
