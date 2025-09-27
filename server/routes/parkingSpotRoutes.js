
const express = require('express');
const router = express.Router();
const parkingSpotController = require('../controllers/parkingSpotController');

router.post('/', parkingSpotController.createSpot);
router.get('/', parkingSpotController.getSpots);
router.get('/available/:lotId', parkingSpotController.getAvailableSpotsByLotAndTime);
router.get('/:id', parkingSpotController.getSpotById);
router.put('/:id', parkingSpotController.updateSpot);
router.delete('/:id', parkingSpotController.deleteSpot);

module.exports = router;
