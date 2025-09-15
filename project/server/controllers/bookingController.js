const prisma = require('../generated/prisma');

exports.createBooking = async (req, res) => {
  try {
    const { userId, lotId, spotId, vehicleId, startTime, endTime, status, totalAmount } = req.body;
    const booking = await prisma.booking.create({ data: { userId, lotId, spotId, vehicleId, startTime, endTime, status, totalAmount } });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ include: { user: true, lot: true, spot: true, vehicle: true } });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.booking.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
