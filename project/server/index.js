//import express from "express";
const express =  require('express');
const cors = require('cors');
const { sendToArduino, getLatestArduinoData, openGate, closeGate, onData } = require('./arduinoSerial');
require('./rfidBridge');
//const apiRoutes = require('./routes');
const rfidRoutes = require('./routes/rfid');
//const arduinoRoutes = require('./routes/arduino');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const parkingLotRoutes = require('./routes/parkingLotRoutes');
const parkingSpotRoutes = require('./routes/parkingSpotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const parkingSessionRoutes = require('./routes/parkingSessionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cardDataRoutes = require('./routes/cardDataRoutes');
const adminManager = require('./routes/admin')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/admin', adminManager);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/lots', parkingLotRoutes);
app.use('/api/spots', parkingSpotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/sessions', parkingSessionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cards', cardDataRoutes);
//app.use('/api', apiRoutes);
app.use('/api/rfid', rfidRoutes);
// app.use('/api/arduino', arduinoRoutes);

// app.get("/api/arduino", (req, res) => {
//   res.json({ status: "ok", latest: getLatestArduinoData() });
// });
// app.post("/api/arduino", (req, res) => {
//   const { message } = req.body;
//   sendToArduino(message);
//   res.json({ status: "ok", sent: message });
// });
// app.post('/api/gate/open', (req, res) => {
//   openGate();
//   res.json({ status: 'ok' });
// });
// app.post('/api/gate/close', (req, res) => {
//   closeGate();
//   res.json({ status: 'ok' });
// });

// // SSE stream for live Arduino data
// app.get('/api/arduino/stream', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders && res.flushHeaders();

//   // send last value if exists
//   const last = getLatestArduinoData();
//   if (last) res.write(`data: ${JSON.stringify({ line: last })}\n\n`);

//   const unsubscribe = onData((line) => {
//     res.write(`data: ${JSON.stringify({ line })}\n\n`);
//   });

//   req.on('close', () => {
//     unsubscribe();
//     res.end();
//   });
// });

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
