const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      default: 0
    },
    atsScore: {
      type: Number,
      default: 0
    },
    keywordScore: {
      type: Number,
      default: 0
    },
    skillsScore: {
      type: Number,
      default: 0
    },
    experienceScore: {
      type: Number,
      default: 0
    },
    formattingScore: {
      type: Number,
      default: 0
    },
    projectScore: {
      type: Number,
      default: 0
    },
    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: [String],
      default: []
    },
    education: {
      type: [String],
      default: []
    },
    projects: {
      type: [String],
      default: []
    },
    certifications: {
      type: [String],
      default: []
    },
    suggestions: {
      type: [String],
      default: []
    },
    missingKeywords: {
      type: [String],
      default: []
    },
    weakSections: {
      type: [String],
      default: []
    },
    improvementAreas: {
      type: [String],
      default: []
    },
    coverLetter: {
      type: String,
      default: ''
    },
    rawText: {
      type: String,
      default: ''
    },
    contactInfo: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    jobMatch: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    optimizedResume: {
      type: String,
      default: ''
    },
    jobDescription: {
      type: String,
      default: ''
    },
    analysisMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    analyzedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

resumeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
