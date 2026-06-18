const Resume = require('../models/Resume');
const atsService = require('../services/atsService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const loadResumeContext = async (req) => {
  if (req.file) {
    return {
      filePath: req.file.path || '',
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileBuffer: req.file.buffer
    };
  }

  if (req.body.resumeId) {
    const resume = await Resume.findOne({ _id: req.body.resumeId, userId: req.user._id });
    if (!resume) {
      throw new AppError('Resume not found.', 404);
    }

    return resume;
  }

  throw new AppError('Provide either resumeId or a resume file.', 400);
};

const analyzeResume = asyncHandler(async (req, res) => {
  const resumeContext = await loadResumeContext(req);
  const analysis = resumeContext.fileBuffer
    ? await atsService.analyzeResumeBuffer({
        buffer: resumeContext.fileBuffer,
        filename: resumeContext.fileName,
        mimetype: resumeContext.fileType,
        jobDescription: req.body.jobDescription || '',
        targetRole: req.body.targetRole || ''
      })
    : await atsService.analyzeResumeFile({
        filePath: resumeContext.filePath,
        filename: resumeContext.fileName,
        mimetype: resumeContext.fileType,
        jobDescription: req.body.jobDescription || '',
        targetRole: req.body.targetRole || ''
      });

  if (req.body.resumeId) {
    await Resume.findByIdAndUpdate(req.body.resumeId, {
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
      suggestions: analysis.suggestions || [],
      missingKeywords: analysis.missingKeywords || [],
      weakSections: analysis.weakSections || [],
      improvementAreas: analysis.improvementAreas || [],
      rawText: analysis.rawText || '',
      jobDescription: req.body.jobDescription || '',
      certifications: analysis.certifications || [],
      contactInfo: {
        name: analysis.name || '',
        email: analysis.email || '',
        phone: analysis.phone || ''
      },
      jobMatch: analysis.jobMatch || {},
      analysisMetadata: analysis
    });
  }

  res.json({
    success: true,
    data: {
      analysis
    }
  });
});

const optimizeResume = asyncHandler(async (req, res) => {
  const resumeContext = await loadResumeContext(req);
  const optimized = resumeContext.fileBuffer
    ? await atsService.optimizeResumeBuffer({
        buffer: resumeContext.fileBuffer,
        filename: resumeContext.fileName,
        mimetype: resumeContext.fileType,
        jobDescription: req.body.jobDescription || '',
        targetRole: req.body.targetRole || ''
      })
    : await atsService.optimizeResumeFile({
        filePath: resumeContext.filePath,
        filename: resumeContext.fileName,
        mimetype: resumeContext.fileType,
        jobDescription: req.body.jobDescription || '',
        targetRole: req.body.targetRole || ''
      });

  if (req.body.resumeId) {
    await Resume.findByIdAndUpdate(req.body.resumeId, {
      suggestions: optimized.suggestions || [],
      missingKeywords: optimized.missingKeywords || [],
      improvementAreas: optimized.improvementAreas || [],
      coverLetter: optimized.coverLetter || '',
      optimizedResume: optimized.optimizedResume || '',
      analysisMetadata: optimized.analysis || optimized
    });
  }

  res.json({
    success: true,
    data: {
      optimized
    }
  });
});

const exportResume = asyncHandler(async (req, res) => {
  const exported = await atsService.exportDocument({
    content: req.body.content || '',
    file_name: req.body.fileName || 'optimized-resume',
    format: req.body.format || 'pdf',
    title: req.body.title || 'Resume',
    kind: req.body.kind || 'resume'
  });

  res.setHeader('Content-Type', exported.contentType);
  res.setHeader('Content-Disposition', exported.disposition);
  res.send(exported.buffer);
});

const generateCoverLetter = asyncHandler(async (req, res) => {
  let resume = null;
  if (req.body.resumeId) {
    resume = await Resume.findOne({ _id: req.body.resumeId, userId: req.user._id });
    if (!resume) {
      throw new AppError('Resume not found.', 404);
    }
  }

  const generated = await atsService.generateCoverLetter({
    resumeSummary: resume?.rawText || '',
    jobTitle: req.body.jobTitle || req.body.targetRole || '',
    companyName: req.body.companyName || '',
    jobDescription: req.body.jobDescription || '',
    skills: resume?.skills || req.body.skills || [],
    experience: resume?.experience || req.body.experience || []
  });

  if (resume) {
    await Resume.findByIdAndUpdate(resume._id, {
      coverLetter: generated.coverLetter || ''
    });
  }

  res.json({
    success: true,
    data: {
      coverLetter: generated.coverLetter || generated,
      meta: generated
    }
  });
});

module.exports = {
  analyzeResume,
  optimizeResume,
  generateCoverLetter,
  exportResume
};
