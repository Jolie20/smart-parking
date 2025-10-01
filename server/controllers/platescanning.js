const PlateLicense = require('../models/PlateLicense');
const Booking = require('../models/Booking');

// This function should be called when a new plate message is received from MQTT
async function handlePlateMessage(plateNumber) {
    // Normalize plate number (optional, e.g., uppercase and trim)
    const normalizedPlate = plateNumber.trim().toUpperCase();
    // Add plate to PlateLicense database if not already present
    let plateDoc = await PlateLicense.findOne({ plate: normalizedPlate });
    if (!plateDoc) {
        plateDoc = new PlateLicense({ plate: normalizedPlate });
        await plateDoc.save();
    }

    // Check if plate exists in Booking database
    const booking = await Booking.findOne({ plate: normalizedPlate });
    const isBooked = !!booking;

    // Return result or handle as needed
    return { plate: normalizedPlate, isBooked };
}

module.exports = { handlePlateMessage };