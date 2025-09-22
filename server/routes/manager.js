const express = require('express');
const router = express.Router();
const { authenticate, requireRole, ManagerLogin } = require('../middleware/auth');
const manager = require('../controllers/managerController');

router.post('/login', ManagerLogin);
router.use(authenticate, requireRole('manager', 'admin'));
router.get('/lots', manager.getManagedLots);
router.get('/sessions', manager.getManagedSessions);

module.exports = router;


