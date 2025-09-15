// const { onData } = require('./arduinoSerial');

// let lastUid = null;

// function normalizeUidFromLine(line) {
//   // Example line: "Card UID: 31 B6 13 1B"
//   const match = line.match(/Card UID:\s+([0-9A-Fa-f\s]+)/);
//   if (!match) return null;
//   const bytes = match[1]
//     .trim()
//     .split(/\s+/)
//     .map((b) => b.toUpperCase());
//   // Join as hex without spaces (e.g., 31B6131B)
//   return bytes.join('');
// }

// // subscribe to serial data
// onData((line) => {
//   const uid = normalizeUidFromLine(line);
//   if (uid) lastUid = uid;
// });

// function getLastUid() {
//   return lastUid;
// }

// module.exports = { getLastUid };


