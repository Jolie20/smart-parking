const { SerialPort,ReadlineParser } = require('serialport');

const port = new SerialPort({ path: "COM9", baudRate: 9600 });

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// Listen for Arduino messages
parser.on("data", (data) => {
  console.log("Arduino says:", data);
});

// Function to send data to Arduino
exports.getArduinoData = function (callback) {
  parser.on("data", function (data) {
    console.log("Arduino says:", data.toString());
    if (callback) {
      callback(data.toString()); // send data back to caller
    }
  });
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