const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { registerValidation, loginValidation, validateRequest } = require('../utils/validators');

const router = express.Router();

router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.get('/me', protect, authController.getCurrentUser);
router.delete('/delete-account', protect, authController.deleteAccount);
router.post('/logout', protect, authController.logout);

module.exports = router;

