const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

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
    const sessions = await prisma.parkingSession.findMany({ 
      where: { lotId: { in: lotIds } },
      include: { user: true, vehicle: true, lot: true, spot: true }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bookings for managed lots
exports.getManagedBookings = async (req, res) => {
  try {
    console.log('Fetching bookings for manager:', req.user.id);
    const lots = await prisma.parkingLot.findMany({ 
      where: { managerId: req.user.id }, 
      select: { id: true } 
    });
    const lotIds = lots.map(l => l.id);
    
    const bookings = await prisma.booking.findMany({ 
      where: { lotId: { in: lotIds } },
      include: { 
        user: true, 
        vehicle: true, 
        lot: true, 
        spot: true 
      },
      orderBy: { startTime: 'desc' }
    });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get booking statistics for managed lots
exports.getBookingStats = async (req, res) => {
  try {
    const lots = await prisma.parkingLot.findMany({ 
      where: { managerId: req.user.id }, 
      select: { id: true, name: true } 
    });
    const lotIds = lots.map(l => l.id);
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const [totalBookings, todayBookings, activeBookings, completedBookings] = await Promise.all([
      prisma.booking.count({ where: { lotId: { in: lotIds } } }),
      prisma.booking.count({ 
        where: { 
          lotId: { in: lotIds },
          createdAt: { gte: startOfDay, lt: endOfDay }
        } 
      }),
      prisma.booking.count({ 
        where: { 
          lotId: { in: lotIds },
          status: 'active'
        } 
      }),
      prisma.booking.count({ 
        where: { 
          lotId: { in: lotIds },
          status: 'completed'
        } 
      })
    ]);
    
    res.json({
      totalBookings,
      todayBookings,
      activeBookings,
      completedBookings,
      managedLots: lots.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


