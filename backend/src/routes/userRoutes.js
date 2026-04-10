import CourseRequest from '../models/CourseRequest.js';
import Notification from '../models/Notification.js';

// User sends a join request
router.post("/:id/join", protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const courseId = req.params.id;

    const existing = await CourseRequest.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const newRequest = await CourseRequest.create({ user: userId, course: courseId });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin/User gets requests
router.get("/requests/all", protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter = { user: req.user.userId };
    }
    const requests = await CourseRequest.find(filter)
      .populate('user', 'username')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin approves or rejects
router.patch("/requests/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Admin only" });

    const { status } = req.body; // 'accepted' or 'rejected'
    const request = await CourseRequest.findById(req.params.id).populate('course');

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      await Course.findByIdAndUpdate(request.course._id, { $inc: { memberCount: 1 } });
    }

    // Create notification for the user
    await Notification.create({
      recipient: request.user,
      message: `Your request for ${request.course.title} was ${status}.`,
      type: status === 'accepted' ? 'success' : 'error'
    });

    res.json({ message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
