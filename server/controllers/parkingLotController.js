const{PrismaClient}= require('../generated/prisma');
const prisma = new PrismaClient();

exports.createLot = async (req, res) => {
  try {
    const { name, address, totalSpots, availableSpots, hourlyRate, managerName, managerEmail } = req.body;

    // Find the manager by name and email
    let manager = await prisma.manager.findFirst({
      where: {
        username: managerName,
        email: managerEmail
      }
    });

    // If manager does not exist, you can choose to create or return error
    if (!manager) {
      manager = await prisma.manager.create({
        data: {
          username: managerName,
          email: managerEmail
        }
      });
    }

    // Create the parking lot with the manager's ID
    const lot = await prisma.parkingLot.create({
      data: {
        name,
        address,
        totalSpots,
        availableSpots,
        hourlyRate,
        managerId: manager.id
      }
    });

    res.status(201).json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLots = async (req, res) => {
  try {
    const lots = await prisma.parkingLot.findMany({ include: { manager: true, spots: true, bookings: true } });
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLotById = async (req, res) => {
  try {
    const { id } = req.params;
    const lot = await prisma.parkingLot.findUnique({ where: { id }, include: { spots: true } });
    res.json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLot = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.parkingLot.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLot = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.parkingLot.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
