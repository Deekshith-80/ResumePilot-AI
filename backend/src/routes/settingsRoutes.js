const express = require('express');
const authController = require('../controllers/authController');
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middlewares/authMiddleware');
const { passwordValidation, themeValidation, validateRequest } = require('../utils/validators');

const router = express.Router();

router.put('/theme', protect, themeValidation, validateRequest, settingsController.updateTheme);
router.put('/password', protect, passwordValidation, validateRequest, settingsController.updatePassword);
router.post('/logout', protect, settingsController.logout);
router.delete('/delete-account', protect, authController.deleteAccount);

module.exports = router;
