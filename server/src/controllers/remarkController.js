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
  const { applicationId, universityApplicationId, content, attachmentUrl, attachmentName } = req.body;

  let targetUserId;
  let targetTitle = 'New Remark from Admin';
  let targetEmail;
  let targetIdForLink;

  if (universityApplicationId) {
    const UniversityApplication = require('../models/UniversityApplication');
    const universityApp = await UniversityApplication.findById(universityApplicationId).populate('student');
    if (!universityApp) {
      res.status(404);
      throw new Error('University application not found');
    }
    targetUserId = universityApp.student._id;
    targetEmail = universityApp.student.email;
    targetIdForLink = universityApp._id;
  } else {
    const application = await Application.findById(applicationId).populate('user');
    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }
    targetUserId = application.user?._id;
    targetEmail = application.user?.email;
    targetIdForLink = application._id;
  }

  const remark = await Remark.create({
    application: applicationId || undefined,
    universityApplication: universityApplicationId || undefined,
    sender: req.user._id,
    senderDesignation: req.user.designation || (req.user.role === 'admin' ? 'Admin' : 'Student'),
    content,
    attachmentUrl,
    attachmentName,
  });

  // Notify student if remark is from admin
  if (req.user.role === 'admin' && targetUserId) {
    if (targetEmail) {
      sendRemarkNotification(targetEmail, content, targetIdForLink);
    }
    await Notification.create({
      user: targetUserId,
      title: targetTitle,
      message: `${req.user.designation || 'Admin'} left a remark: "${content.substring(0, 30)}..."`,
      type: 'general'
    });
  } else if (req.user.role === 'student') {
    // Notify admins if student replies
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: 'New Student Reply',
        message: `Student replied in remarks: "${content.substring(0, 30)}..."`,
        type: 'general'
      });
    }
  }

  res.status(201).json(remark);
});

// @desc    Get all remarks for an application (master or university)
// @route   GET /api/remarks/:id
// @access  Private
const getRemarks = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.query; // type can be 'master' or 'university'

  let query = {};
  if (type === 'university') {
    query = { universityApplication: id };
  } else {
    query = { application: id };
  }

  const remarks = await Remark.find(query)
    .populate('sender', 'email designation role')
    .sort({ createdAt: 1 });

  res.json(remarks);
});

module.exports = {
  addRemark,
  getRemarks,
};
