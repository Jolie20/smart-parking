const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const express = require('express');
const { sendEmail } = require('../utilies/mail');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.Adminseed = async (req,res) => {
  const {username,email,password} = req.body;
  if (!username || !email || !password) return res.status(400).json("all field are required", error.message);
  const alreadyexist = await prisma.admin.findUnique({where :{email}});
  if (alreadyexist) return res.status(400).json("Email already exist");
  const passwordHash = await bcrypt.hash(password, 10);
  try{
    const admin = await prisma.admin.create({ data:
      {
        username,
        email,
        password:passwordHash,
      }

    });
    return res.status(200).json('admin created sucess',admin);
  }catch(err){
    return res.status(500).json('internal server error', err.message);
  }
};

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
    const { email, username, phone, password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });
    const passwordHash = await bcrypt.hash(password, 10);
    const manager = await prisma.manager.create({ data: { email, username, phone, password: passwordHash } });
     // Compose the email
    const subject = 'Welcome to Our Platform! Confirm Your Invitation';
    const html = `
      <h1>Hello ${username},</h1>
      <p>You have been invited as a manager. Please confirm your invitation by clicking the link below:</p>
      <a href="http://localhost:5173/confirm-invitation?email=${encodeURIComponent(email)}">Confirm Invitation</a>
      <p>If you did not expect this email, please ignore it.</p>
    `;

    // Send the email (assuming sendEmail is async)
    await sendEmail(email, subject, html);
    res.status(201).json(manager);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
return res.status(500).json({ error: error.message })
};

//get all managers
exports.getManagers = async (req, res) => {
  try {
    const managers = await prisma.manager.findMany();
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
