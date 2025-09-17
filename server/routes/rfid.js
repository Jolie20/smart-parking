const express = require('express');
const router = express.Router();
const { prisma } = require('../db');
const { openGate, closeGate } = require('../arduinoSerial');
const { getLastUid } = require('../rfidBridge');

// Check-in by RFID card ID: assigns an available spot and opens gate
router.post('/checkin', async (req, res) => {
  try {
    let { rfidCard, lotId } = req.body;
    if (!rfidCard) rfidCard = getLastUid();
    if (!rfidCard || !lotId) return res.status(400).json({ error: 'rfidCard and lotId are required' });

    const vehicle = await prisma.vehicle.findUnique({ where: { rfidCard } });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found for card' });

    const spot = await prisma.parkingSpot.findFirst({ where: { lotId, isAvailable: true, isReserved: false } });
    if (!spot) return res.status(409).json({ error: 'No available spots' });

    const session = await prisma.$transaction(async (tx) => {
      const updatedSpot = await tx.parkingSpot.update({ where: { id: spot.id }, data: { isAvailable: false, vehicleId: vehicle.id } });
      const lot = await tx.parkingLot.update({ where: { id: lotId }, data: { availableSpots: { decrement: 1 } } });
      const created = await tx.parkingSession.create({ data: { userId: vehicle.userId, vehicleId: vehicle.id, lotId, spotId: updatedSpot.id, checkInTime: new Date(), status: 'active' } });
      return created;
    });

    openGate();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check-out by RFID card ID: computes fee, frees spot, closes gate
router.post('/checkout', async (req, res) => {
  try {
    let { rfidCard } = req.body;
    if (!rfidCard) rfidCard = getLastUid();
    if (!rfidCard) return res.status(400).json({ error: 'rfidCard is required' });

    const vehicle = await prisma.vehicle.findUnique({ where: { rfidCard } });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found for card' });

    const session = await prisma.parkingSession.findFirst({ where: { vehicleId: vehicle.id, status: 'active' }, orderBy: { checkInTime: 'desc' } });
    if (!session) return res.status(404).json({ error: 'Active session not found' });

    const lot = await prisma.parkingLot.findUnique({ where: { id: session.lotId } });
    const minutes = Math.max(1, Math.ceil((Date.now() - new Date(session.checkInTime).getTime()) / 60000));
    const amount = (lot?.hourlyRate ? lot.hourlyRate : 60) * (minutes / 60);

    const updated = await prisma.$transaction(async (tx) => {
      await tx.parkingSpot.update({ where: { id: session.spotId }, data: { isAvailable: true, vehicleId: null, isReserved: false } });
      await tx.parkingLot.update({ where: { id: session.lotId }, data: { availableSpots: { increment: 1 } } });
      return tx.parkingSession.update({ where: { id: session.id }, data: { status: 'completed', checkOutTime: new Date(), duration: minutes, amount } });
    });

    closeGate();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;


