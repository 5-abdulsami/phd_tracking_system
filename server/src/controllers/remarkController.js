const asyncHandler = require('express-async-handler');
const Remark = require('../models/Remark');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Application = require('../models/Application');
const { sendRemarkNotification } = require('../utils/emailService');

// @desc    Add a new remark to an application
// @route   POST /api/remarks
// @access  Private
const addRemark = asyncHandler(async (req, res) => {
  const { applicationId, content, attachmentUrl, attachmentName } = req.body;

  const application = await Application.findById(applicationId).populate('user');
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  const remark = await Remark.create({
    application: applicationId,
    sender: req.user._id,
    senderDesignation: req.user.designation || (req.user.role === 'admin' ? 'Admin' : 'Student'),
    content,
    attachmentUrl,
    attachmentName,
  });

  // Notify student if remark is from admin
  if (req.user.role === 'admin' && application.user) {
    sendRemarkNotification(application.user.email, content, application._id);
    await Notification.create({
      user: application.user._id,
      title: 'New Remark from Admin',
      message: `${req.user.designation || 'Admin'} left a remark on your application: "${content.substring(0, 30)}..."`,
      type: 'general'
    });
  } else if (req.user.role === 'student') {
    // Notify admins if student replies
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: 'New Student Reply',
        message: `Student (${application.user.email}) replied in remarks: "${content.substring(0, 30)}..."`,
        type: 'general'
      });
    }
  }

  res.status(201).json(remark);
});

// @desc    Get all remarks for an application
// @route   GET /api/remarks/:applicationId
// @access  Private
const getRemarks = asyncHandler(async (req, res) => {
  const remarks = await Remark.find({ application: req.params.applicationId })
    .populate('sender', 'email designation role')
    .sort({ createdAt: 1 });

  res.json(remarks);
});

module.exports = {
  addRemark,
  getRemarks,
};
