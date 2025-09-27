const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();
exports.createSpot = async (req, res) => {
  try {
    const { spotNumber, isAvailable, isReserved, vehicleId,lotname } = req.body;
    const parkingLot = await prisma.parkingLot.findFirst({ where: { name: lotname } });
    if (!parkingLot) return res.status(400).json({ error: 'Invalid lotId' }); 
    const spot = await prisma.parkingSpot.create({ data: { spotNumber, isAvailable, isReserved, vehicleId, lotId:parkingLot.id } });
    res.status(201).json(spot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSpots = async (req, res) => {
  try {
    const spots = await prisma.parkingSpot.findMany({ include: { lot: true, vehicle: true } });
    res.json(spots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSpotById = async (req, res) => {
  try {
    const { id } = req.params;
    const spot = await prisma.parkingSpot.findUnique({ where: { id } });
    res.json(spot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSpot = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.parkingSpot.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSpot = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.parkingSpot.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get available spots by lot and time
exports.getAvailableSpotsByLotAndTime = async (req, res) => {
  try {
    const { lotId } = req.params;
    const { startTime, endTime } = req.query;
    
    // Get all spots for the lot
    const spots = await prisma.parkingSpot.findMany({ 
      where: { lotId },
      include: { lot: true, vehicle: true }
    });
    
    // Filter available spots (basic check - in real implementation, you'd check against existing bookings)
    const availableSpots = spots.filter(spot => 
      spot.isAvailable && !spot.isReserved && !spot.vehicleId
    );
    
    res.json(availableSpots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get spots by lot id

