const Job = require('../models/Job');
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const seedJobsIfNeeded = require('../utils/seedJobs');
const { rankJobsForResume, scoreJob } = require('../services/jobMatchService');

const ensureSeeded = async () => {
  await seedJobsIfNeeded();
};

const getJobs = asyncHandler(async (req, res) => {
  await ensureSeeded();

  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
  const skip = (page - 1) * limit;

  const filters = { isActive: true };
  if (req.query.category) {
    filters.category = req.query.category;
  }

  if (req.query.q) {
    filters.$or = [
      { title: { $regex: req.query.q, $options: 'i' } },
      { description: { $regex: req.query.q, $options: 'i' } },
      { category: { $regex: req.query.q, $options: 'i' } }
    ];
  }

  const [jobs, total] = await Promise.all([
    Job.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Job.countDocuments(filters)
  ]);

  res.json({
    success: true,
    data: {
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

const getJobById = asyncHandler(async (req, res, next) => {
  await ensureSeeded();
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new AppError('Job not found.', 404));
  }

  res.json({
    success: true,
    data: {
      job
    }
  });
});

const getMatches = asyncHandler(async (req, res, next) => {
  await ensureSeeded();
  const latestResume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

  if (!latestResume) {
    return res.json({
      success: true,
      data: {
        matches: [],
        message: 'Upload a resume to see job matches.'
      }
    });
  }

  const jobs = await Job.find({ isActive: true });
  const matches = rankJobsForResume(latestResume, jobs);
  const recentApplications = await Application.find({ userId: req.user._id })
    .populate('jobId')
    .sort({ appliedAt: -1 })
    .limit(10);

  res.json({
    success: true,
    data: {
      latestResume,
      matches,
      recentApplications
    }
  });
});

const applyToJob = asyncHandler(async (req, res, next) => {
  await ensureSeeded();
  const job = await Job.findById(req.body.jobId);
  if (!job) {
    return next(new AppError('Job not found.', 404));
  }

  const resume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
  const matchResult = scoreJob(resume || {}, job);

  const application = await Application.findOneAndUpdate(
    { userId: req.user._id, jobId: job._id },
    {
      userId: req.user._id,
      jobId: job._id,
      resumeId: resume?._id || null,
      status: 'applied',
      matchPercentage: matchResult.matchPercentage,
      appliedAt: new Date()
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  ).populate('jobId');

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully.',
    data: {
      application,
      match: matchResult
    }
  });
});

module.exports = {
  getJobs,
  getJobById,
  getMatches,
  applyToJob
};

