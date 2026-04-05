import Course from "../models/Course.js";
import CourseOptions from "../models/CourseOptions.js";
import CourseMember from "../models/CourseMember.js";
import Post from "../models/Post.js";
import path from "path";

export const getAllCourses = async (req, res) => {
  try {
    const { title, type, sort, q } = req.query;

    let matchStage = {};

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
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "course",
          as: "posts"
        }
      },
      {
        $addFields: { discussionCount: { $size: "$posts" } }
      },
      { $unset: "posts" }
    ];

    if (sort === "az") pipeline.push({ $sort: { title: 1 } });
    else if (sort === "za") pipeline.push({ $sort: { title: -1 } });
    else if (sort === "most") pipeline.push({ $sort: { memberCount: -1 } });
    else if (sort === "least") pipeline.push({ $sort: { memberCount: 1 } });

    const courses = await Course.aggregate(pipeline);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message
    });
  }
};

export const joinCourse = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const existing = await CourseMember.findOne({ courseId: req.params.id, userId: currentUserId });
    if (existing) {
      return res.status(400).json({ message: "Already a member" });
    }

    await CourseMember.create({ courseId: req.params.id, userId: currentUserId, roleInCourse: "Member" });

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $inc: { memberCount: 1 } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Joined successfully",
      memberCount: course.memberCount
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to join course",
      error: error.message
    });
  }
};

export const leaveCourse = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const deleted = await CourseMember.findOneAndDelete({ courseId: req.params.id, userId: currentUserId });
    if (!deleted) {
      return res.status(400).json({ message: "You are not a member of this course" });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $inc: { memberCount: -1 } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Left successfully", memberCount: course.memberCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to leave course", error: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id: courseId, userId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const deleted = await CourseMember.findOneAndDelete({ courseId, userId });
    if (!deleted) {
      return res.status(404).json({ message: "Member not found in this course" });
    }

    await Course.findByIdAndUpdate(courseId, { $inc: { memberCount: -1 } });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove member", error: error.message });
  }
};

export const getJoinedCourses = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const memberships = await CourseMember.find({ userId: currentUserId }).populate("courseId");
    const courses = memberships.map((m) => m.courseId).filter(Boolean);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch joined courses", error: error.message });
  }
};

export const getCourseMembers = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId).populate("createdBy", "username email role");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const creatorId = course.createdBy?._id?.toString();

    const members = await CourseMember.find({ courseId })
      .populate("userId", "username email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      creator: course.createdBy,
      members: members
        .filter((m) => m.userId?._id?.toString() !== creatorId)
        .map((m) => ({
          _id: m._id,
          userId: m.userId,
          roleInCourse: m.roleInCourse,
          joinedAt: m.createdAt
        }))
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch members", error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // to count posts related to this course
    const discussionCount = await Post.countDocuments({
      course: courseId
    });

    // add discussionCount to the course object before sending response
    const result = {
      ...course.toObject(),
      discussionCount
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch course",
      error: error.message
    });
  }
};

export const searchCourses = async (req, res) => {
  try {
    const query = req.query.q || "";

    if (!query.trim()) {
      const courses = await Course.find();
      return res.status(200).json(courses);
    }

    const results = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { field: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
        { tags: { $elemMatch: { $regex: query, $options: "i" } } }
      ]
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Failed to search courses",
      error: error.message
    });
  }
};

export const getCourseOptions = async (req, res) => {
  try {
    let options = await CourseOptions.findOne();

    if (!options) {
      options = await CourseOptions.create({
        types: [
          "Bootcamp",
          "Lab",
          "Lecture",
          "Seminar",
          "Tutorial",
          "Workshop"
        ],
        fields: [
          "Arts",
          "Biology",
          "Business",
          "Chemistry",
          "Computer Science",
          "Data Science",
          "Economics",
          "Engineering",
          "Mathematics",
          "Physics",
          "Psychology",
          "Statistics"
        ],
        tags: [
          "Beginner",
          "Intermediate",
          "Advanced",
          "Programming",
          "Web Development",
          "React",
          "JavaScript",
          "Database",
          "Design",
          "Frontend",
          "Backend",
          "AI",
          "Machine Learning",
          "Math",
          "Science"
        ]
      });
    }

    res.status(200).json({
      types: options.types,
      fields: options.fields,
      tags: options.tags
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch course options",
      error: error.message
    });
  }
};

export async function createCourse(req, res) {
  try {
    const {
      title,
      type,
      field,
      description,
      startDate,
      endDate,
      location,
      tags
    } = req.body;

    if (!title || !type || !field || !description) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const options = await CourseOptions.findOne();

    if (!options) {
      return res.status(400).json({
        message: "Course options not set up yet"
      });
    }

    if (!options.types.includes(type)) {
      return res.status(400).json({
        message: "Invalid course type"
      });
    }

    if (!options.fields.includes(field)) {
      return res.status(400).json({
        message: "Invalid course field"
      });
    }

    const submittedTags = Array.isArray(tags) ? tags : [];

    const hasInvalidTag = submittedTags.some((tag) => !options.tags.includes(tag));

    if (hasInvalidTag) {
      return res.status(400).json({
        message: "One or more tags are invalid"
      });
    }

    const newCourse = new Course({
      title,
      type,
      field,
      description,
      location: location || "",
      tags: submittedTags,
      memberCount: 0,
      duration: {
        startDate: startDate || null,
        endDate: endDate || null
      },
      createdBy: req.user?.userId || null
    });

    const savedCourse = await newCourse.save();

    if (req.user?.userId) {
      await CourseMember.create({
        courseId: savedCourse._id,
        userId: req.user.userId,
        roleInCourse: "Admin"
      });
      await Course.findByIdAndUpdate(savedCourse._id, { $inc: { memberCount: 1 } });
    }

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: "Failed to create course"
    });
  }
}

// GET /api/courses/:id/posts
export const getCoursePosts = async (req, res) => {
  try {
    const posts = await Post.find({ course: req.params.id })
      .populate("author", "username email role")
      .populate("replies.author", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message
    });
  }
};

// POST /api/courses/:id/posts
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const files = req.files || [];
    const courseId = req.params.id;
    const currentUserId = req.user.userId;

    if ((!text || !text.trim()) && files.length === 0) {
      return res.status(400).json({ message: "Text or file is required" });
    }

    if (!courseId) {
      return res.status(400).json({ message: "Course id is required" });
    }

    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const attachments = files.map((file) => ({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      uploadedBy: currentUserId
    }));

    const newPost = new Post({
      text: text?.trim() || "",
      course: courseId,
      attachments,
      author: currentUserId
    });

    const savedPost = await newPost.save();

    const populatedPost = await Post.findById(savedPost._id)
      .populate("author", "username email role")
      .populate("replies.author", "username email role");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("createPost error:", error);
    res.status(500).json({
      message: "Failed to create post",
      error: error.message
    });
  }
};

// POST /api/courses/:courseId/posts/:postId/replies
export const createReply = async (req, res) => {
  try {
    const { text } = req.body;
    const { courseId, postId } = req.params;
    const currentUserId = req.user.userId;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const post = await Post.findOne({
      _id: postId,
      course: courseId
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newReply = {
      text: text.trim(),
      author: currentUserId,
      createdAt: new Date()
    };

    post.replies.push(newReply);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username email role")
      .populate("replies.author", "username email role");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("createReply error:", error);
    res.status(500).json({
      message: "Failed to create reply",
      error: error.message
    });
  }
};

export async function deletePost(req, res) {
  try {
    const { courseId, postId } = req.params;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    const post = await Post.findOne({ _id: postId, course: courseId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwner = String(post.author) === String(currentUserId);
    const isAdmin = currentUserRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own post" });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete post",
      error: error.message
    });
  }
}

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course and delete it
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Oops! This course doesn't exist anymore." });
    }

    // Also delete all posts associated with this course
    await Post.deleteMany({ course: courseId });

    res.status(200).json({ message: "Course and its posts were removed successfully!" });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to delete the course", 
      error: error.message 
    });
  }
};
export const updateCourse = async (req, res) => {
  try {
    const { title, description, type, field, tags, location, startDate, endDate } = req.body;

    const options = await CourseOptions.findOne();
    if (!options) {
      return res.status(400).json({ message: "Course options not set up yet" });
    }

    if (type && !options.types.includes(type)) {
      return res.status(400).json({ message: "Invalid course type" });
    }

    if (field && !options.fields.includes(field)) {
      return res.status(400).json({ message: "Invalid course field" });
    }

    if (tags) {
      const submittedTags = Array.isArray(tags) ? tags : [];
      const hasInvalidTag = submittedTags.some((tag) => !options.tags.includes(tag));
      if (hasInvalidTag) {
        return res.status(400).json({ message: "One or more tags are invalid" });
      }
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (type !== undefined) updateFields.type = type;
    if (field !== undefined) updateFields.field = field;
    if (tags !== undefined) updateFields.tags = Array.isArray(tags) ? tags : [];
    if (location !== undefined) updateFields.location = location;
    if (startDate !== undefined) updateFields["duration.startDate"] = startDate || null;
    if (endDate !== undefined) updateFields["duration.endDate"] = endDate || null;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Failed to update course", error: error.message });
  }
};

export const downloadAttachment = async (req, res) => {
  try {
    const { postId, attachmentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const attachment = post.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const relativePath = attachment.fileUrl.replace(/^\/+/, "");
    const absolutePath = path.resolve(relativePath);

    return res.download(absolutePath, attachment.fileName);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to download attachment",
      error: error.message
    });
  }
};

export async function deleteReply(req, res) {
  try {
    const { courseId, postId, replyId } = req.params;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    const post = await Post.findOne({ _id: postId, course: courseId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const reply = post.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const isOwner = String(reply.author) === String(currentUserId);
    const isAdmin = currentUserRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own reply" });
    }

    reply.deleteOne();
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username email role")
      .populate("replies.author", "username email role");

    return res.status(200).json(populatedPost);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete reply",
      error: error.message
    });
  }
}