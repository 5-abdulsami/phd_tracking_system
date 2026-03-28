const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get or create current student application
// @route   GET /api/applications/me
// @access  Private (Student)
const getMyApplication = async (req, res) => {
  let application = await Application.findOne({ user: req.user._id });

  if (!application) {
    application = await Application.create({
      user: req.user._id,
      status: 'draft',
    });
  }

  res.json(application);
};

// @desc    Update application section
// @route   PUT /api/applications/me/section/:section
// @access  Private (Student)
const updateSection = async (req, res) => {
  const { section } = req.params;
  const data = req.body;

  const application = await Application.findOne({ user: req.user._id });

  if (!application) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  // Basic validation that section exists in schema
  if (!application[section] && section !== 'academicBackground' && section !== 'referees') {
     // Allow array types too if they aren't directly children of schema but they are in this case
  }

  application[section] = data;
  
  // Recalculate completion percentage (simple version)
  const sections = [
    'applicantInfo', 'contactDetails', 'guardianInfo', 'academicBackground', 
    'programInfo', 'researchExperience', 'englishProficiency', 'fundingInfo', 
    'referees', 'documents', 'declaration'
  ];
  
  let filledCount = 0;
  sections.forEach(s => {
    if (application[s] && (Array.isArray(application[s]) ? application[s].length > 0 : Object.keys(application[s]).length > 0)) {
      filledCount++;
    }
  });
  
  application.completionPercentage = Math.round((filledCount / sections.length) * 100);

  const updatedApplication = await application.save();
  res.json(updatedApplication);
};

// @desc    Submit application
// @route   POST /api/applications/me/submit
// @access  Private (Student)
const submitApplication = async (req, res) => {
  const application = await Application.findOne({ user: req.user._id });

  if (!application) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  if (application.completionPercentage < 90) { // Requirement to be mostly filled
    res.status(400).json({ message: 'Please complete all sections before submitting' });
    return;
  }

  application.status = 'submitted';
  application.submittedAt = new Date();
  
  const updatedApplication = await application.save();
  res.json(updatedApplication);
};

// Admin Controllers

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
  const applications = await Application.find({}).populate('user', 'email');
  res.json(applications);
};

// @desc    Update application status
// @route   PUT /api/admin/applications/:id/status
// @access  Private (Admin)
const updateStatus = async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id);

  if (application) {
    application.status = status;
    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } else {
    res.status(404).json({ message: 'Application not found' });
  }
};

module.exports = {
  getMyApplication,
  updateSection,
  submitApplication,
  getAllApplications,
  updateStatus,
};
