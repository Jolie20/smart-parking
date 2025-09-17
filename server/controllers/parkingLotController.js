const prisma = require('../generated/prisma');

exports.createLot = async (req, res) => {
  try {
    const { name, address, totalSpots, availableSpots, hourlyRate, managerId } = req.body;
    const lot = await prisma.parkingLot.create({ data: { name, address, totalSpots, availableSpots, hourlyRate, managerId } });
    res.status(201).json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLots = async (req, res) => {
  try {
    const lots = await prisma.parkingLot.findMany({ include: { manager: true, spots: true, bookings: true } });
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLotById = async (req, res) => {
  try {
    const { id } = req.params;
    const lot = await prisma.parkingLot.findUnique({ where: { id }, include: { spots: true } });
    res.json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLot = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.parkingLot.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLot = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.parkingLot.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
