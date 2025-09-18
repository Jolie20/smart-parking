const  {PrismaClient}= require('../generated/prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
// Create User
exports.createUser = async (req, res) => {
  try {
    
    const { email, name, role, phone, password, rfidno } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing
    const user = await prisma.user.create({
      data: { email, name, role, phone, password:hashedPassword, rfidno }
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { vehicles: true, lots: true, bookings: true, sessions: true } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id }, include: { vehicles: true } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.user.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
