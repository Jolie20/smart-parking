
const express = require('express');
const router = express.Router();
const cardDataController = require('../controllers/cardDataController');

router.post('/', cardDataController.createCard);
router.get('/', cardDataController.getCards);

module.exports = router;
