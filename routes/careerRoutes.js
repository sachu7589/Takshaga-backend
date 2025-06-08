const express = require('express');
const router = express.Router();
const multer = require('multer');
const Resume = require('../models/career');

const upload = multer({ storage: multer.memoryStorage() });

// http://localhost:3000/api/careers/upload
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, job } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }
    
    const newResume = new Resume({
      name,
      email,
      phone,
      job,
      resume: req.file.buffer,
      resumeMimeType: req.file.mimetype
    });
    
    await newResume.save();
    res.status(200).json({ message: 'Resume uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all resumes with their details
// http://localhost:3000/api/careers/display
router.get('/display', async (req, res) => {
  try {
    const resumes = await Resume.find({});
    
    // Transform the data to include a download URL instead of the actual PDF buffer
    const resumesWithDownloadUrls = resumes.map(resume => {
      const resumeObj = resume.toObject();
      
      // Remove the actual buffer from the response to reduce payload size
      delete resumeObj.resume;
      
      // Add the download URL that the frontend can use
      resumeObj.downloadUrl = `/api/careers/resume/${resume._id}`;
      
      return resumeObj;
    });
    
    res.status(200).json(resumesWithDownloadUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get resume PDF by ID - this endpoint will be called by the frontend when user clicks download
// http://localhost:3000/api/careers/resume/:id
router.get('/resume/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume || !resume.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Set appropriate headers for PDF download
    res.set({
      'Content-Type': resume.resumeMimeType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${resume.name.replace(/\s+/g, '_')}_resume.pdf"`,
      'Content-Length': resume.resume.length
    });
    
    // Send the PDF file
    res.send(resume.resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;