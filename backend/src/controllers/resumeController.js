const path = require('path');
const Resume = require('../models/Resume');
const ResumeVersion = require('../models/ResumeVersion');
const Application = require('../models/Application');
const atsService = require('../services/atsService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const { saveBufferToFile, buildPublicUrl, deleteIfExists } = require('../utils/fileHelpers');

const resumeDir = path.join(__dirname, '..', 'uploads', 'resumes');

const buildResumeFileMeta = (req, fileName) => {
  const baseUrl = env.backendUrl || `${req.protocol}://${req.get('host')}`;
  return buildPublicUrl(baseUrl, `/uploads/resumes/${fileName}`);
};

const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a PDF or DOCX resume.', 400));
  }

  const { jobDescription = '', targetRole = '' } = req.body;
  const { fileName, filePath } = await saveBufferToFile(resumeDir, req.file.originalname, req.file.buffer);
  const fileUrl = buildResumeFileMeta(req, fileName);

  const analysis = await atsService.analyzeResumeBuffer({
    buffer: req.file.buffer,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    jobDescription,
    targetRole
  });

  const resume = await Resume.create({
    userId: req.user._id,
    fileName,
    fileUrl,
    filePath,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    atsScore: analysis.overallScore || 0,
    keywordScore: analysis.keywordScore || 0,
    skillsScore: analysis.skillsScore || 0,
    experienceScore: analysis.experienceScore || 0,
    formattingScore: analysis.formattingScore || 0,
    projectScore: analysis.projectScore || 0,
    skills: analysis.skills || [],
    experience: analysis.experience || [],
    education: analysis.education || [],
    projects: analysis.projects || [],
    certifications: analysis.certifications || [],
    suggestions: analysis.suggestions || [],
    missingKeywords: analysis.missingKeywords || [],
    weakSections: analysis.weakSections || [],
    improvementAreas: analysis.improvementAreas || [],
    rawText: analysis.rawText || '',
    jobDescription,
    contactInfo: {
      name: analysis.name || '',
      email: analysis.email || '',
      phone: analysis.phone || ''
    },
    jobMatch: analysis.jobMatch || {},
    analysisMetadata: analysis,
    analyzedAt: new Date()
  });

  const versionNumber = (await ResumeVersion.countDocuments({ userId: req.user._id })) + 1;
  await ResumeVersion.create({
    userId: req.user._id,
    resumeId: resume._id,
    versionNumber,
    snapshot: {
      atsScore: resume.atsScore,
      keywordScore: resume.keywordScore,
      skillsScore: resume.skillsScore,
      experienceScore: resume.experienceScore,
      formattingScore: resume.formattingScore,
      projectScore: resume.projectScore,
      skills: resume.skills,
      suggestions: resume.suggestions,
      missingKeywords: resume.missingKeywords,
      weakSections: resume.weakSections,
      improvementAreas: resume.improvementAreas,
      certifications: resume.certifications,
      contactInfo: resume.contactInfo,
      jobMatch: resume.jobMatch
    }
  });

  res.status(201).json({
    success: true,
    message: 'Resume uploaded and analyzed successfully.',
    data: {
      resume: {
        ...resume.toObject(),
        analysisSource: analysis.analysisSource || 'python'
      }
    }
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const [resumes, versions] = await Promise.all([
    Resume.find({ userId: req.user._id }).sort({ createdAt: -1 }),
    ResumeVersion.find({ userId: req.user._id }).sort({ versionNumber: -1 })
  ]);

  res.json({
    success: true,
    data: {
      resumes,
      versions
    }
  });
});

const getResumeById = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) {
    return next(new AppError('Resume not found.', 404));
  }

  const versions = await ResumeVersion.find({ userId: req.user._id, resumeId: resume._id }).sort({ versionNumber: -1 });

  res.json({
    success: true,
    data: {
      resume,
      versions
    }
  });
});

const deleteResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) {
    return next(new AppError('Resume not found.', 404));
  }

  await Promise.all([
    deleteIfExists(resume.filePath),
    ResumeVersion.deleteMany({ userId: req.user._id, resumeId: resume._id }),
    Application.updateMany({ userId: req.user._id, resumeId: resume._id }, { $unset: { resumeId: 1 } }),
    Resume.deleteOne({ _id: resume._id })
  ]);

  res.json({
    success: true,
    message: 'Resume deleted successfully.'
  });
});

module.exports = {
  uploadResume,
  getHistory,
  getResumeById,
  deleteResume
};
