// const { SerialPort, ReadlineParser } = require('serialport');

// const port = new SerialPort({ path: process.env.ARDUINO_PORT || "COM9", baudRate: 9600 });
// const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// let latestLine = null;
// const listeners = new Set();
// let latestMessage = null;
// let latestBalance = null;
// let latestCost = null;
// let latestTime = null;
// parser.on("data", (data) => {
//   latestLine = data.toString();
//   console.log("Arduino says:", latestLine);
//   latestMessage = latestLine;

//   try {
//     let match = null;
//     if (/Balance/i.test(latestLine)) {
//       match = latestLine.match(/Balance[^0-9]*([0-9]+(?:\.[0-9]+)?)/i);
//     }
//     if (!match) {
//       const nums = latestLine.match(/([0-9]+(?:\.[0-9]+)?)/g);
//       if (nums && nums.length) match = [null, nums[nums.length - 1]];
//     }
//     if (match) {
//       const val = Number(match[1]);
//       if (!Number.isNaN(val)) latestBalance = val;
//     }
//     // Parse parking cost lines
//     if (/Parking\s*Cost/i.test(latestLine)) {
//       const m2 = latestLine.match(/Cost[^0-9]*([0-9]+(?:\.[0-9]+)?)/i);
//       if (m2) {
//         const c = Number(m2[1]);
//         if (!Number.isNaN(c)) latestCost = c;
//       }
//     }
    
//     // Parse parking time/duration lines
//     if (/Parking\s*Time|Duration|Time\s*Spent/i.test(latestLine)) {
//       const timeMatch = latestLine.match(/(?:Time|Duration)[^0-9]*([0-9]+(?:\.[0-9]+)?)\s*(?:min|minutes?|hr|hours?)/i);
//       if (timeMatch) {
//         const t = Number(timeMatch[1]);
//         if (!Number.isNaN(t)) {
//           // Convert to minutes if hours
//           if (/hr|hours?/i.test(latestLine)) {
//             latestTime = t * 60;
//           } else {
//             latestTime = t;
//           }
//         }
//       }
//     }
//   } catch (_) {}
//   for (const cb of listeners) {
//     try { cb(latestLine); } catch (_) {}
//   }
// });

// exports.getLatestArduinoData = function () {
//   return latestLine;
// };

// exports.sendToArduino = function (msg) {
//   port.write(msg + "\n", function (err) {
//     if (err) {
//       console.error("Error writing to Arduino:", err.message);
//     } else {
//       console.log("Message sent to Arduino:", msg);
//     }
//   });
// };

// exports.openGate = function () {
//   exports.sendToArduino("OPEN_GATE");
// };

// exports.closeGate = function () {
//   exports.sendToArduino("CLOSE_GATE");
// };

// exports.onData = function (callback) {
//   listeners.add(callback);
//   return () => listeners.delete(callback);
// };

// exports.getLatestMessage = function () {
//   return latestMessage;
// };

// exports.getLatestBalance = function () {
//   return latestBalance;
// };

// exports.getLatestCost = function () {
//   return latestCost;
// };

// exports.getLatestTime = function () {
//   return latestTime;
// };