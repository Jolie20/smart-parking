const express = require('express');
const router = express.Router();
const { authenticate, requireRole, ManagerLogin } = require('../middleware/auth');
const manager = require('../controllers/managerController');

router.use(authenticate, requireRole('manager', 'admin'));
router.post('/login', ManagerLogin);

router.get('/lots', manager.getManagedLots);
router.get('/sessions', manager.getManagedSessions);

module.exports = router;


