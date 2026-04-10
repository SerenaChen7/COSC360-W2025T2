import express from 'express';
import CourseRequest from '../models/CourseRequest.js';
import Notification from '../models/Notification.js';
import Course from '../models/Course.js';
import CourseMember from '../models/CourseMember.js'; 
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// User applies to join (status: pending)
router.post("/join/:courseId", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;
    const { courseId } = req.params;
    const existing = await CourseRequest.findOne({ user: userId, course: courseId });
    if (existing) return res.status(400).json({ message: "Request already exists" });

    const newRequest = await CourseRequest.create({ user: userId, course: courseId, status: 'pending' });
    res.status(201).json(newRequest);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin fetches requests
router.get("/requests", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;
    let query = req.user.role === 'admin' ? { status: 'pending' } : { user: userId };
    const requests = await CourseRequest.find(query)
      .populate('user', 'username email').populate('course', 'title').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin action: Accept or Reject
router.patch("/requests/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Admin only" });
    const { status } = req.body;
    const request = await CourseRequest.findById(req.params.id).populate('course');
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      // 1. Update Course students array and count
      await Course.findByIdAndUpdate(request.course._id, { 
        $addToSet: { students: request.user }, 
        $inc: { memberCount: 1 } 
      });

      // 2. CREATE MEMBER RECORD (This makes it show up in Dashboard)
      await CourseMember.create({
        courseId: request.course._id,
        userId: request.user,
        roleInCourse: "Member"
      });
    }

    // 3. Create notification using userId field
    await Notification.create({
      userId: request.user,
      message: `Your request for ${request.course.title || 'the course'} was ${status}.`,
      isRead: false,
      type: status === 'accepted' ? 'success' : 'error'
    });

    res.json({ message: "Updated successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;