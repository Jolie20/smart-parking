const { prisma } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

exports.getSystemStats = async (req, res) => {
  try {
    const [users, vehicles, lots, sessions] = await Promise.all([
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.parkingLot.count(),
      prisma.parkingSession.count(),
    ]);
    res.json({ users, vehicles, lots, sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const list = await prisma.user.findMany();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignManagerToLot = async (req, res) => {
  try {
    const { lotId, managerId } = req.body;
    const lot = await prisma.parkingLot.update({ where: { id: lotId }, data: { managerId } });
    res.json(lot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createManager = async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });
    const passwordHash = await bcrypt.hash(password, 10);
    const manager = await prisma.user.create({ data: { email, name, phone, role: 'manager', password: passwordHash } });
    res.status(201).json(manager);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


