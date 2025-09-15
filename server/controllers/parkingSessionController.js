const prisma = require('../generated/prisma');

exports.createSession = async (req, res) => {
  try {
    const { userId, vehicleId, lotId, spotId, checkInTime, checkOutTime, duration, amount, status } = req.body;
    const session = await prisma.parkingSession.create({ data: { userId, vehicleId, lotId, spotId, checkInTime, checkOutTime, duration, amount, status } });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await prisma.parkingSession.findMany({ include: { user: true, vehicle: true, lot: true, spot: true } });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.parkingSession.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.parkingSession.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
