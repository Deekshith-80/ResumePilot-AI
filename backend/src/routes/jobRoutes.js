const express = require('express');
const jobController = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');
const { applicationValidation, validateRequest, idValidation } = require('../utils/validators');

const router = express.Router();

router.get('/', protect, jobController.getJobs);
router.get('/matches', protect, jobController.getMatches);
router.get('/:id', protect, idValidation, validateRequest, jobController.getJobById);
router.post('/apply', protect, applicationValidation, validateRequest, jobController.applyToJob);

module.exports = router;

