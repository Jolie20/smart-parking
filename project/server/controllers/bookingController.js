const { prisma } = require('../db');

exports.createBooking = async (req, res) => {
  try {
    const { userId, lotId, spotId, vehicleId, startTime, endTime, status, totalAmount } = req.body;
    const booking = await prisma.booking.create({ data: { userId:{connect:{id:userId}}, lotId:{connect:{id:lotId}}, spotId:{connect:{id:spotId}}, vehicleId:{connect:{id:vehicleId}}, startTime: new Date(startTime), endTime: new Date(endTime), status, totalAmount } });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { userId, lotId, spotId, vehicleId, startTime, endTime, status, totalAmount } = req.body;
    const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { userId, lotId, spotId, vehicleId, startTime: startTime ? new Date(startTime) : undefined, endTime: endTime ? new Date(endTime) : undefined, status, totalAmount } });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


