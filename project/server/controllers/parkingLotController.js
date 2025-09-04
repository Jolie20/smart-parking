const { prisma } = require('../db');

exports.createParkingLot = async (req, res) => {
  try {
    const { name, address, totalSpots, availableSpots, hourlyRate, managerId } = req.body;
    const lot = await prisma.parkingLot.create({ data: { name, address, totalSpots, availableSpots, hourlyRate, managerId } });
    res.status(201).json(lot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getParkingLots = async (req, res) => {
  try {
    const lots = await prisma.parkingLot.findMany({ include: { spots: true } });
    res.json(lots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParkingLotById = async (req, res) => {
  try {
    const lot = await prisma.parkingLot.findUnique({ where: { id: req.params.id }, include: { spots: true } });
    if (!lot) return res.status(404).json({ error: 'Parking lot not found' });
    res.json(lot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateParkingLot = async (req, res) => {
  try {
    const { name, address, totalSpots, availableSpots, hourlyRate, managerId } = req.body;
    const lot = await prisma.parkingLot.update({ where: { id: req.params.id }, data: { name, address, totalSpots, availableSpots, hourlyRate, managerId } });
    res.json(lot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteParkingLot = async (req, res) => {
  try {
    await prisma.parkingLot.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


