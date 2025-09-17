
const express = require('express');
const router = express.Router();
const parkingSessionController = require('../controllers/parkingSessionController');

router.post('/', parkingSessionController.createSession);
router.get('/', parkingSessionController.getSessions);
router.put('/:id', parkingSessionController.updateSession);
router.delete('/:id', parkingSessionController.deleteSession);

module.exports = router;
