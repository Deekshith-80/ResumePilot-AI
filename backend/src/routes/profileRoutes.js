const express = require('express');
const profileController = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');
const { avatarUpload } = require('../middlewares/uploadMiddleware');
const { profileValidation, validateRequest } = require('../utils/validators');

const router = express.Router();

router.get('/', protect, profileController.getProfile);
router.put('/', protect, avatarUpload.single('avatar'), profileValidation, validateRequest, profileController.updateProfile);
router.get('/stats', protect, profileController.getStats);

module.exports = router;

