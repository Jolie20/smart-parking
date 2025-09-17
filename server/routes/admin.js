const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const admin = require('../controllers/adminController');

router.post('/create',admin.Adminseed);
//router.use(authenticate, requireRole('admin'));
router.get('/stats', admin.getSystemStats);
router.get('/users', admin.listUsers);
router.post('/assign-manager', admin.assignManagerToLot);
router.post('/managers', admin.createManager);

module.exports = router;


