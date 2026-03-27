import Course from "../models/Course.js";

export const getAllCourses = async (req, res) => {
  try {
    const { title, type, sort, q } = req.query;

    let filter = {};

    if (q) {
      filter = {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { field: { $regex: q, $options: "i" } },
          { type: { $regex: q, $options: "i" } },
          { tags: { $elemMatch: { $regex: q, $options: "i" } } }
        ]
      };
    }

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (type) {
      filter.type = { $regex: type, $options: "i" };
    }

    let query = Course.find(filter);

    if (sort === "az") {
      query = query.sort({ title: 1 });
    } else if (sort === "za") {
      query = query.sort({ title: -1 });
    } else if (sort === "most") {
      query = query.sort({ memberCount: -1 });
    } else if (sort === "least") {
      query = query.sort({ memberCount: 1 });
    }

    const courses = await query;
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message
    });
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

    const newCourse = new Course({
      title,
      type,
      field,
      description,
      startDate,
      endDate,
      location: location || "",
      tags: tags || [],
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