import express from 'express';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all notifications for the current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id || req.user.userId;

    if (!currentUserId) {
      return res.status(401).json({ error: "User ID not found in request" });
    }

    const notifications = await Notification.find({ userId: currentUserId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(notifications);
  } catch (err) {
    console.error("GET Notifications Error:", err.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// POST mark all as read
router.post('/read-all', requireAuth, async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id || req.user.userId;

    if (!currentUserId) {
      return res.status(401).json({ error: "User ID not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(currentUserId);

    const result = await Notification.updateMany(
      { 
        userId: userObjectId, 
        isRead: false 
      },
      { 
        $set: { isRead: true } 
      }
    );

    console.log(`[Sync] Updated ${result.modifiedCount} notifications for user ${currentUserId}`);

    res.status(200).json({ 
      message: "Success",
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    console.error("POST Mark-Read Error:", err.message);
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

// DELETE single notification
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const notifId = req.params.id;
    const currentUserId = req.user._id || req.user.id || req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(notifId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Ensure users can only delete their own notifications
    const deletedNotification = await Notification.findOneAndDelete({ 
      _id: notifId, 
      userId: currentUserId 
    });

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found or unauthorized" });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE Notification Error:", err.message);
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;