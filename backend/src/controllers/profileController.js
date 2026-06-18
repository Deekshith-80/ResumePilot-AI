const path = require('path');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const { parseListField, saveBufferToFile, buildPublicUrl, deleteIfExists } = require('../utils/fileHelpers');

const avatarDir = path.join(__dirname, '..', 'uploads', 'avatars');

const calculateProfileCompletion = (user) => {
  const requiredFields = ['name', 'email', 'phone', 'location', 'bio'];
  const filledRequired = requiredFields.filter((field) => Boolean(user[field] && String(user[field]).trim())).length;
  const skillsFilled = Array.isArray(user.skills) && user.skills.length > 0 ? 1 : 0;
  const total = requiredFields.length + 1;
  return Math.round(((filledRequired + skillsFilled) / total) * 100);
};

const getProfile = asyncHandler(async (req, res) => {
  const [user, resumeHistory, applicationHistory] = await Promise.all([
    User.findById(req.user._id),
    Resume.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10),
    Application.find({ userId: req.user._id }).populate('jobId').sort({ appliedAt: -1 }).limit(20)
  ]);

  res.json({
    success: true,
    data: {
      profile: {
        ...user.toJSON(),
        profileCompletion: calculateProfileCompletion(user)
      },
      resumeHistory,
      applicationHistory
    }
  });
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const updates = {};
  ['name', 'email', 'phone', 'location', 'bio'].forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = String(req.body[field]).trim();
    }
  });

  if (req.body.skills !== undefined) {
    updates.skills = parseListField(req.body.skills);
  }

  if (req.file) {
    const { fileName } = await saveBufferToFile(avatarDir, req.file.originalname, req.file.buffer);
    const baseUrl = env.backendUrl || `${req.protocol}://${req.get('host')}`;
    updates.avatar = buildPublicUrl(baseUrl, `/uploads/avatars/${fileName}`);

    if (req.user.avatar && req.user.avatar.includes('/uploads/avatars/')) {
      const previousFile = path.join(__dirname, '..', 'uploads', 'avatars', path.basename(req.user.avatar));
      await deleteIfExists(previousFile);
    }
  }

  if (!Object.keys(updates).length) {
    return next(new AppError('No profile updates provided.', 400));
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    message: 'Profile updated successfully.',
    data: {
      user
    }
  });
});

const getStats = asyncHandler(async (req, res) => {
  const [user, totalResumes, totalApplications, shortlistedApplications, recentResume] = await Promise.all([
    User.findById(req.user._id),
    Resume.countDocuments({ userId: req.user._id }),
    Application.countDocuments({ userId: req.user._id }),
    Application.countDocuments({ userId: req.user._id, status: 'shortlisted' }),
    Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 })
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        profileCompletion: calculateProfileCompletion(user),
        totalResumes,
        totalApplications,
        shortlistedApplications,
        latestAtsScore: recentResume?.atsScore || 0,
        latestResumeAt: recentResume?.createdAt || null
      }
    }
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getStats
};
