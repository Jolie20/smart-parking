const express = require('express');
const router = express.Router();
const { getLatestMessage, getLatestBalance, getLatestCost, getLatestTime } = require('../arduinoSerial');

router.get('/message', (req, res) => {
  res.json({ message: getLatestMessage() });
});

router.get('/balance', (req, res) => {
  res.json({ balance: getLatestBalance() });
});

router.get('/cost', (req, res) => {
  res.json({ cost: getLatestCost() });
});

router.get('/time', (req, res) => {
  res.json({ time: getLatestTime() });
});

module.exports = router;


