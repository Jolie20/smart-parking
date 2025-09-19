const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { authenticate, requireRole } = require('../middleware/auth');
const admin = require('../controllers/adminController');

router.post('/login',auth.AdminLogin);//completed
router.post('/create',admin.Adminseed);//completed
router.use(authenticate, requireRole('ADMIN'));//completed
router.get('/stats', admin.getSystemStats);
router.get('/users', admin.listUsers);
router.post('/assign-manager', admin.assignManagerToLot);
router.post('/managers', admin.createManager);//completed
router.get('/managers', admin.getManagers);//completed

module.exports = router;


