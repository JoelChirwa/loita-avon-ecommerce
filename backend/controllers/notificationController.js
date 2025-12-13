import webpush from 'web-push';
import Notification from '../models/Notification.js';
import PushSubscription from '../models/PushSubscription.js';

// Configure web-push with VAPID keys only if keys are provided
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@loitashop.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
// @access  Private
export const subscribeToPush = async (req, res) => {
  try {
    // Skip if VAPID keys not configured
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return res.json({
        success: true,
        message: 'Push notifications not configured on server'
      });
    }

    const { endpoint, keys } = req.body;

    if (!endpoint || !keys) {
      return res.status(400).json({
        success: false,
        message: 'Missing endpoint or keys'
      });
    }

    // Check if subscription already exists
    let subscription = await PushSubscription.findOne({ endpoint });

    if (subscription) {
      subscription.user = req.user._id;
      subscription.keys = keys;
      subscription.isActive = true;
      await subscription.save();
    } else {
      subscription = await PushSubscription.create({
        user: req.user._id,
        endpoint,
        keys
      });
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to push notifications'
    });
  } catch (error) {
    console.error('Subscribe to push error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Notification.countDocuments({ user: req.user._id });
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    notification.readAt = Date.now();
    await notification.save();

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.deleteOne();

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send notification (Admin)
// @route   POST /api/notifications/send
// @access  Private/Admin
export const sendNotification = async (req, res) => {
  try {
    const { userIds, title, message, type, link } = req.body;

    // Create notifications in database
    const notifications = await Notification.insertMany(
      userIds.map(userId => ({
        user: userId,
        title,
        message,
        type,
        link
      }))
    );

    // Send push notifications
    const subscriptions = await PushSubscription.find({
      user: { $in: userIds },
      isActive: true
    });

    const pushPromises = subscriptions.map(sub => {
      const pushPayload = JSON.stringify({
        title,
        body: message,
        icon: '/logo192.png',
        badge: '/logo192.png',
        data: { link }
      });

      return webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys
        },
        pushPayload
      ).catch(err => {
        console.error('Push notification error:', err);
        // Deactivate failed subscription
        sub.isActive = false;
        sub.save();
      });
    });

    await Promise.allSettled(pushPromises);

    res.json({
      success: true,
      message: `Sent ${notifications.length} notifications`,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
