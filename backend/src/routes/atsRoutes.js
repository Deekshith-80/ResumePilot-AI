const express = require('express');
const atsController = require('../controllers/atsController');
const { protect } = require('../middlewares/authMiddleware');
const { resumeUpload } = require('../middlewares/uploadMiddleware');
const { atsValidation, validateRequest } = require('../utils/validators');

const router = express.Router();

router.post('/analyze', protect, resumeUpload.single('resume'), atsValidation, validateRequest, atsController.analyzeResume);
router.post('/optimize', protect, resumeUpload.single('resume'), atsValidation, validateRequest, atsController.optimizeResume);
router.post('/generate-cover-letter', protect, atsValidation, validateRequest, atsController.generateCoverLetter);
router.post('/export', protect, atsController.exportResume);

module.exports = router;
