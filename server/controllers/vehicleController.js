const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createVehicle = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  try {
    const { licensePlate, make, model, color, year, vehicleType } = req.body;
    const vehicle = await prisma.vehicle.create({ 
      data: { 
        user: { connect: { id: userId }}, 
        licensePlate, 
        make, 
        model, 
        color, 
        year: year ? parseInt(year) : null,
        vehicleType: vehicleType || 'car',
        isActive: true,
        rfidCard: req.user.rfidno ? req.user.id : null
      } 
    });
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

exports.uservehicles = async (req, res) => {
  console.log('Request body:', req.body); //ADD
  const { licensePlate, make, model, color, year, vehicleType } = req.body; //ADD
  console.log("userbody",req.user); //ADD
  const userId = req.user.id;
  console.log("User ID:", userId);
  console.log('Data to create:', { //ADD
  licensePlate,
  make,
  model,
  color,
  year,
  vehicleType,
  userId
})
  try {
     // Debugging line
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const vehicles = await prisma.vehicle.findMany({ where: { userId } });
    return res.status(200).json(vehicles);
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ error: err.message });
  }
};