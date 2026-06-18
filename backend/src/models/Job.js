const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      default: ''
    },
    salary: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

jobSchema.index({ title: 'text', description: 'text', category: 'text', requiredSkills: 'text' });

module.exports = mongoose.model('Job', jobSchema);

