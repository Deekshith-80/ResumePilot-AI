const express = require('express');
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');
const { resumeUpload } = require('../middlewares/uploadMiddleware');
const { idValidation, validateRequest } = require('../utils/validators');

const router = express.Router();

router.post('/upload', protect, resumeUpload.single('resume'), resumeController.uploadResume);
router.get('/history', protect, resumeController.getHistory);
router.get('/:id', protect, idValidation, validateRequest, resumeController.getResumeById);
router.delete('/:id', protect, idValidation, validateRequest, resumeController.deleteResume);

module.exports = router;
