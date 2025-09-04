const { prisma } = require('../db');

exports.createSession = async (req, res) => {
  try {
    const { userId, vehicleId, lotId, spotId, checkInTime, checkOutTime, duration, amount, status } = req.body;
    const session = await prisma.parkingSession.create({ data: { userId, vehicleId, lotId, spotId, checkInTime: new Date(checkInTime), checkOutTime: checkOutTime ? new Date(checkOutTime) : null, duration, amount, status } });
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await prisma.parkingSession.findMany();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await prisma.parkingSession.findUnique({ where: { id: req.params.id } });
    if (!session) return res.status(404).json({ error: 'Parking session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { userId, vehicleId, lotId, spotId, checkInTime, checkOutTime, duration, amount, status } = req.body;
    const session = await prisma.parkingSession.update({ where: { id: req.params.id }, data: { userId, vehicleId, lotId, spotId, checkInTime: checkInTime ? new Date(checkInTime) : undefined, checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined, duration, amount, status } });
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await prisma.parkingSession.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


