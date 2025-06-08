const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  job: {
    type: String,
    required: true,
    trim: true
  },
  resume: Buffer, // This stores the PDF file
  resumeMimeType: String, // 'application/pdf'
}, {
  timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);
