import Course from "../models/Course.js";
import CourseOptions from "../models/CourseOptions.js";

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
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $inc: { memberCount: 1 } },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Joined successfully", memberCount: course.memberCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to join course", error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
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
      duration: {
        startDate: startDate || null,
        endDate: endDate || null
      },
      createdBy: null
    });

    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: "Failed to create course"
    });
  }
}