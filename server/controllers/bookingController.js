const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createBooking = async (req, res) => {
  const userId = req.user.id; // Extracted from login/session      
    console.log('the user id from token is',userId);
    const { lotName, spotNumber, vehiclePlate, startTime, endTime, totalAmount } = req.body;

  try {
    // Validate required fields
    if (!lotName || !spotNumber || !vehiclePlate || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate date/time format
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date/time format' });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    
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
        user: {connect:{id: userId}},
        lot: { connect: { id: lot.id } },
        spot: { connect: { id: spot.id } },
        vehicle: { connect: { id: vehicle.id } },
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        status:'active',
        paymentstatus:'pending',
        totalAmount
      }
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking creation error:', err);
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
