const express = require('express');
const router = express.Router();
const { authenticate, requireRole, ManagerLogin } = require('../middleware/auth');
const manager = require('../controllers/managerController');

router.post('/login', ManagerLogin);
router.get('/lots', authenticate, requireRole('manager'), manager.getManagedLots);
router.get('/sessions', authenticate, requireRole('manager'), manager.getManagedSessions);
router.get('/bookings', authenticate, requireRole('manager'), manager.getManagedBookings);
router.get('/stats', authenticate, requireRole('manager'), manager.getBookingStats);
//router.get('/spots', authenticate, requireRole('manager'), manager.getAllSpotsInManagedLots);

module.exports = router;


