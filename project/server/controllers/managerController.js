const { prisma } = require('../db');

exports.getManagedLots = async (req, res) => {
  try {
    const lots = await prisma.parkingLot.findMany({ where: { managerId: req.user.id }, include: { spots: true } });
    res.json(lots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getManagedSessions = async (req, res) => {
  try {
    const lots = await prisma.parkingLot.findMany({ where: { managerId: req.user.id }, select: { id: true } });
    const lotIds = lots.map(l => l.id);
    const sessions = await prisma.parkingSession.findMany({ where: { lotId: { in: lotIds } } });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


