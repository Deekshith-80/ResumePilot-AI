const mongoose = require('mongoose');

const resumeVersionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true
    },
    versionNumber: {
      type: Number,
      required: true
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

resumeVersionSchema.index({ userId: 1, versionNumber: -1 });

module.exports = mongoose.model('ResumeVersion', resumeVersionSchema);

