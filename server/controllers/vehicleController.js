const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createVehicle = async (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  try {
    const { licensePlate, make, model, color, rfidCard } = req.body;
    const vehicle = await prisma.vehicle.create({ data: { userId, licensePlate, make, model, color, rfidCard } });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({ include: { user: true } });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.vehicle.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vehicle.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
