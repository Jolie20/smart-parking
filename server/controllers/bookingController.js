const { connect } = require('mongoose');
const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createBooking = async (req, res) => {
  const userId = req.user; // Extracted from login/session      
    console.log('the user id from token is',userId);
    const { lotName, spotNumber, vehiclePlate, startTime, endTime, totalAmount } = req.body;

  try {
    
    // Find lotId by lotName
    const lot = await prisma.parkingLot.findFirst({ where: { name: lotName } });
    if (!lot) 
      {
        console.log('Invalid lot name:', lotName);
        return res.status(400).json({ error: 'Invalid lot name' });
      }

    // Find spotId by spotNumber and lotId
    const spot = await prisma.parkingSpot.findFirst({ where: { spotNumber, lotId: lot.id } });
    if (!spot) return res.status(400).json({ error: 'Invalid spot number for this lot' });

    // Find vehicleId by licensePlate and userId
    const vehicle = await prisma.vehicle.findFirst({ where: { licensePlate: vehiclePlate, userId } });
    if (!vehicle) return res.status(400).json({ error: 'Invalid vehicle plate for this user' });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        user: {connect:{id:userId}},
        lot: { connect: { id: lotId } },
        spotId: spot.id,
        vehicleId: vehicle.id,
        startTime,
        endTime,
        status:'pending',
        totalAmount
      }
    });

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
