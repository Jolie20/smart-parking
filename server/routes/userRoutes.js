const auth = require('../middleware/auth');
const { authenticate, requireRole } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {uservehicles} = require('../controllers/vehicleController');

router.post('/', userController.createUser);
router.get('/myvehicle', authenticate, userController.getvehicles);
router.get('/bookings', authenticate, userController.getuserbookings);
router.post('/v1/login', auth.UserLogin);
router.get('/',authenticate,requireRole('ADMIN'), userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);  
router.delete('/:id', userController.deleteUser);



module.exports = router;
