import Course from "../models/Course.js";
import CourseOptions from "../models/CourseOptions.js";
import CourseMember from "../models/CourseMember.js";
import Post from "../models/Post.js";
import path from "path";

const DEFAULT_COURSE_OPTIONS = {
  types: ["Bootcamp", "Lab", "Lecture", "Seminar", "Tutorial", "Workshop"],
  fields: ["Arts", "Biology", "Business", "Chemistry", "Computer Science", "Data Science", "Economics", "Engineering", "Mathematics", "Physics", "Psychology", "Statistics"],
  tags: ["Beginner", "Intermediate", "Advanced", "Programming", "Web Development", "React", "JavaScript", "Database", "Design", "Frontend", "Backend", "AI", "Machine Learning", "Math", "Science"]
};

// Ensure course categories exist in database
async function ensureCourseOptions() {
  const options = await CourseOptions.findOneAndUpdate(
    {},
    { $set: DEFAULT_COURSE_OPTIONS },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return options;
}

// Get all courses with search and sorting
export const getAllCourses = async (req, res) => {
  try {
    const { title, type, sort, q } = req.query;
    const matchStage = {};

    if (q) {
      matchStage.$or = [
        { title: { $regex: q, $options: "i" } },
        { field: { $regex: q, $options: "i" } },
        { type: { $regex: q, $options: "i" } },
        { tags: { $elemMatch: { $regex: q, $options: "i" } } }
      ];
    }
    if (title) matchStage.title = { $regex: title, $options: "i" };
    if (type) matchStage.type = { $regex: type, $options: "i" };

    const pipeline = [
      { $match: matchStage },
      { $lookup: { from: "posts", localField: "_id", foreignField: "course", as: "posts" } },
      { $addFields: { discussionCount: { $size: "$posts" } } },
      { $unset: "posts" }
    ];

    if (sort === "az") pipeline.push({ $sort: { title: 1 } });
    else if (sort === "za") pipeline.push({ $sort: { title: -1 } });
    else if (sort === "most") pipeline.push({ $sort: { memberCount: -1 } });
    else if (sort === "least") pipeline.push({ $sort: { memberCount: 1 } });

    const courses = await Course.aggregate(pipeline);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};

// Directly join a course (bypassing request system if needed)
export const joinCourse = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id || req.user.userId;
    if (!currentUserId) return res.status(401).json({ message: "Authentication required" });

    const existing = await CourseMember.findOne({ courseId: req.params.id, userId: currentUserId });
    if (existing) return res.status(400).json({ message: "Already a member" });

    await CourseMember.create({ courseId: req.params.id, userId: currentUserId, roleInCourse: "Member" });
    const course = await Course.findByIdAndUpdate(req.params.id, { $inc: { memberCount: 1 } }, { new: true });

    res.status(200).json({ message: "Joined successfully", memberCount: course.memberCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to join", error: error.message });
  }
};

// Leave a course
export const leaveCourse = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id || req.user.userId;
    const deleted = await CourseMember.findOneAndDelete({ courseId: req.params.id, userId: currentUserId });
    if (!deleted) return res.status(400).json({ message: "Not a member" });

    const course = await Course.findByIdAndUpdate(req.params.id, { $inc: { memberCount: -1 } }, { new: true });
    res.status(200).json({ message: "Left successfully", memberCount: course.memberCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to leave", error: error.message });
  }
};

// Admin removes a student
export const removeMember = async (req, res) => {
  try {
    const { id: courseId, userId } = req.params;
    const deleted = await CourseMember.findOneAndDelete({ courseId, userId });
    if (!deleted) return res.status(404).json({ message: "Member not found" });

    await Course.findByIdAndUpdate(courseId, { $inc: { memberCount: -1 } });
    res.status(200).json({ message: "Member removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing member", error: error.message });
  }
};

// Get list of courses user has joined
export const getJoinedCourses = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id || req.user.userId;
    const memberships = await CourseMember.find({ userId: currentUserId }).populate("courseId");
    const courses = memberships.map((m) => m.courseId).filter(Boolean);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch joined courses", error: error.message });
  }
};

// Get all students in a specific course
export const getCourseMembers = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate("createdBy", "username email role");
    if (!course) return res.status(404).json({ message: "Course not found" });

    const members = await CourseMember.find({ courseId }).populate("userId", "username email role").sort({ createdAt: 1 });
    res.status(200).json({
      creator: course.createdBy,
      members: members.map((m) => ({ _id: m._id, userId: m.userId, roleInCourse: m.roleInCourse, joinedAt: m.createdAt }))
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching members", error: error.message });
  }
};

// Get detailed info for one course
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const discussionCount = await Post.countDocuments({ course: req.params.id });
    res.status(200).json({ ...course.toObject(), discussionCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};

// Simple course search
export const searchCourses = async (req, res) => {
  try {
    const query = req.query.q || "";
    const results = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { field: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } }
      ]
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

// Get valid types, fields, and tags
export const getCourseOptions = async (req, res) => {
  try {
    const options = await ensureCourseOptions();
    res.status(200).json({ types: options.types, fields: options.fields, tags: options.tags });
  } catch (error) {
    res.status(500).json({ message: "Error fetching options", error: error.message });
  }
};

// Create a new course
export async function createCourse(req, res) {
  try {
    const { title, type, field, description, startDate, endDate, location, tags } = req.body;
    const currentUserId = req.user._id || req.user.id || req.user.userId;

    if (!title || !type || !field || !description) return res.status(400).json({ message: "Missing fields" });

    const newCourse = new Course({
      title, type, field, description,
      location: location || "",
      tags: Array.isArray(tags) ? tags : [],
      memberCount: 0,
      duration: { startDate: startDate || null, endDate: endDate || null },
      createdBy: currentUserId || null
    });

    const savedCourse = await newCourse.save();

    if (currentUserId) {
      await CourseMember.create({ courseId: savedCourse._id, userId: currentUserId, roleInCourse: "Admin" });
      await Course.findByIdAndUpdate(savedCourse._id, { $inc: { memberCount: 1 } });
    }

    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: "Create failed", error: error.message });
  }
}

// Get all posts for a course
export const getCoursePosts = async (req, res) => {
  try {
    const posts = await Post.find({ course: req.params.id })
      .populate("author", "username email role profileImage")
      .populate("replies.author", "username email role profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

// Create a discussion post
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const files = req.files || [];
    const currentUserId = req.user._id || req.user.id || req.user.userId;

    const attachments = files.map((file) => ({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      uploadedBy: currentUserId
    }));

    const newPost = new Post({ text: text?.trim() || "", course: req.params.id, attachments, author: currentUserId });
    const savedPost = await newPost.save();
    
    const populated = await Post.findById(savedPost._id).populate("author", "username role");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Post creation failed", error: error.message });
  }
};

// Create a reply to a post
export const createReply = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const currentUserId = req.user._id || req.user.id || req.user.userId;

    const post = await Post.findById(postId);
    post.replies.push({ text: text.trim(), author: currentUserId, createdAt: new Date() });
    await post.save();

    const populated = await Post.findById(postId).populate("author replies.author");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Reply failed", error: error.message });
  }
};

// Delete a post
export async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
}

// Delete a whole course
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ course: req.params.id });
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

// Update course details
export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// Download a post attachment
export const downloadAttachment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const attachment = post.attachments.id(req.params.attachmentId);
    const absolutePath = path.resolve(attachment.fileUrl.replace(/^\/+/, ""));
    res.download(absolutePath, attachment.fileName);
  } catch (error) {
    res.status(500).json({ message: "Download failed" });
  }
};

// Delete a specific reply
export async function deleteReply(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    post.replies.id(req.params.replyId).deleteOne();
    await post.save();
    res.status(200).json({ message: "Reply deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
}