const auth = require('../middleware/auth');
const { authenticate, requireRole } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {uservehicles} = require('../controllers/vehicleController');

router.post('/', userController.createUser);
router.post('/v1/login', auth.UserLogin);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/myvehicle',authenticate,uservehicles);

module.exports = router;
