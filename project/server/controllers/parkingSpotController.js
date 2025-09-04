const { prisma } = require('../db');

exports.createParkingSpot = async (req, res) => {
  try {
    const { lotId, spotNumber, isAvailable, isReserved, vehicleId } = req.body;
    const spot = await prisma.parkingSpot.create({ data: { lotId, spotNumber, isAvailable, isReserved, vehicleId } });
    res.status(201).json(spot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getParkingSpots = async (req, res) => {
  try {
    const spots = await prisma.parkingSpot.findMany();
    res.json(spots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParkingSpotById = async (req, res) => {
  try {
    const spot = await prisma.parkingSpot.findUnique({ where: { id: req.params.id } });
    if (!spot) return res.status(404).json({ error: 'Parking spot not found' });
    res.json(spot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateParkingSpot = async (req, res) => {
  try {
    const { lotId, spotNumber, isAvailable, isReserved, vehicleId } = req.body;
    const spot = await prisma.parkingSpot.update({ where: { id: req.params.id }, data: { lotId, spotNumber, isAvailable, isReserved, vehicleId } });
    res.json(spot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteParkingSpot = async (req, res) => {
  try {
    await prisma.parkingSpot.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


