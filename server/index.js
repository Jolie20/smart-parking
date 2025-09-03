//import express from "express";
const express =  require('express');
const cors = require('cors');
const { sendToArduino,getArduinoData } = require('./arduinoSerial');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/arduino", (req, res) => {
  res.json({ status: "ok", received: getArduinoData });
});
app.post("/api/arduino",(req,res)=>{
    const {message} =req.body;
    sendToArduino(message);
    res.json({status:"ok", sent: message});
})

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
