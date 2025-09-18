const auth = require('../middleware/auth');
const { authenticate, requireRole } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.use(authenticate, requireRole('user' || 'ADMIN'));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
