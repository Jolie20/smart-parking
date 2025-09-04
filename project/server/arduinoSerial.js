const { SerialPort, ReadlineParser } = require('serialport');

const port = new SerialPort({ path: process.env.ARDUINO_PORT || "COM9", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let latestLine = null;
const listeners = new Set();
parser.on("data", (data) => {
  latestLine = data.toString();
  console.log("Arduino says:", latestLine);
  for (const cb of listeners) {
    try { cb(latestLine); } catch (_) {}
  }
});

exports.getLatestArduinoData = function () {
  return latestLine;
};

exports.sendToArduino = function (msg) {
  port.write(msg + "\n", function (err) {
    if (err) {
      console.error("Error writing to Arduino:", err.message);
    } else {
      console.log("Message sent to Arduino:", msg);
    }
  });
};

exports.openGate = function () {
  exports.sendToArduino("OPEN_GATE");
};

exports.closeGate = function () {
  exports.sendToArduino("CLOSE_GATE");
};

exports.onData = function (callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
};