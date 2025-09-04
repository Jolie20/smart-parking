const { prisma } = require('../db');

exports.createVehicle = async (req, res) => {
  try {
    const { userId, licensePlate, make, model, color, rfidCard } = req.body;
    const vehicle = await prisma.vehicle.create({ data: { userId, licensePlate, make, model, color, rfidCard } });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { userId, licensePlate, make, model, color, rfidCard } = req.body;
    const vehicle = await prisma.vehicle.update({ where: { id: req.params.id }, data: { userId, licensePlate, make, model, color, rfidCard } });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


