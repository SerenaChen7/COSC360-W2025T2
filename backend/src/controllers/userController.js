import User from "../models/User.js";
import Post from "../models/Post.js";

export const searchUsers = async (req, res) => {
  try {
    const currentUserRole = req.user?.role;
    const q = (req.query.q || "").trim();

    if (currentUserRole !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (!q) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(q, "i");

    // 1) Match username or email
    const directUsers = await User.find({
      $or: [
        { username: { $regex: regex } },
        { email: { $regex: regex } }
      ]
    }).select("username email role profileImage");

    // 2) Match post text, then find related authors
    const authorIdsFromPosts = await Post.distinct("author", {
      text: { $regex: regex }
    });

    let postMatchedUsers = [];
    if (authorIdsFromPosts.length > 0) {
      postMatchedUsers = await User.find({
        _id: { $in: authorIdsFromPosts }
      }).select("username email role profileImage");
    }

    // 3) Merge and dedupe
    const mergedMap = new Map();

    [...directUsers, ...postMatchedUsers].forEach((user) => {
      mergedMap.set(String(user._id), user);
    });

    const results = Array.from(mergedMap.values());

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to search users",
      error: error.message
    });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { userId } = req.params;

    if (String(req.user.userId) === String(userId)) {
      return res.status(400).json({
        message: "You cannot disable your own account"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.isDisabled = !user.isDisabled;
    await user.save();

    return res.status(200).json({
      message: user.isDisabled ? "User disabled successfully" : "User enabled successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
        isDisabled: user.isDisabled
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update user status",
      error: error.message
    });
  }
};