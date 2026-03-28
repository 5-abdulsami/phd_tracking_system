const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }
    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

// @desc    Create notification (Admin only or system triggered)
// @route   POST /api/notifications
// @access  Private (Admin)
const createNotification = async (req, res) => {
  const { userId, title, message, type } = req.body;

  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type: type || 'general',
  });

  res.status(201).json(notification);
};

module.exports = {
  getMyNotifications,
  markRead,
  createNotification,
};
