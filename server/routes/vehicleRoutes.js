const express = require('express');
const{authenticate}=require('../middleware/auth');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.post('/',authenticate, vehicleController.createVehicle);
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);
router.get('/myvehicle',authenticate, vehicleController.getVehiclesByUserId);

module.exports = router;
