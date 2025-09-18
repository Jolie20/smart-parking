
const express = require('express');
const router = express.Router();
const parkingLotController = require('../controllers/parkingLotController');

router.post('/', parkingLotController.createLot);
router.get('/', parkingLotController.getLots);
router.get('/:id', parkingLotController.getLotById);
router.put('/:id', parkingLotController.updateLot);
router.delete('/:id', parkingLotController.deleteLot);

module.exports = router;
