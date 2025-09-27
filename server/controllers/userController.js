const  {PrismaClient}= require('../generated/prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { getVehicles } = require('./vehicleController');

// Create User
exports.createUser = async (req, res) => {
  const { email, name, phone, password } = req.body;
  console.log("recieved body",req.body);
  try {
    
    
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing
    const user = await prisma.user.create({
      data: { email, name, phone, password:hashedPassword,role:'user' },
    });
    res.status(201).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { vehicles: true, bookings: true, sessions: true } });
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
//ADD
exports.getvehicles = async (req, res) => {
  console.log('hello world');
  const userId = req.user.id;
  console.log("User ID:", userId);
  try {
    const vehicles = await prisma.vehicle.findMany({where: { userId  }});
    return res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//users bookings
exports.userbookings = async (req, res) => {
  console.log('Fetching bookings for user');
  const userId = req.user.id;
  try {
    const bookings = await prisma.booking.findMany({ where: { userId }, include: { vehicle: true, lot: true } }); 
    return res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};