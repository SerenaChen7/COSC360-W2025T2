import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockRes } from "./helpers/mockResponse.js";

const validUserId = "507f1f77bcf86cd799439011";
const validCourseId = "507f1f77bcf86cd799439012";

const {
  MockCourse,
  mockAggregate,
  mockFindById,
  mockFindByIdAndUpdate,
  mockCourseOptionsFindOne,
  mockCourseOptionsCreate,
  mockPostCountDocuments,
  mockCourseMemberFindOne,
  mockCourseMemberCreate
} = vi.hoisted(() => {
  const mockAggregate = vi.fn();
  const mockFindById = vi.fn();
  const mockFindByIdAndUpdate = vi.fn();
  const mockCourseOptionsFindOne = vi.fn();
  const mockCourseOptionsCreate = vi.fn();
  const mockPostCountDocuments = vi.fn();
  const mockCourseMemberFindOne = vi.fn();
  const mockCourseMemberCreate = vi.fn();

  function MockCourse(data) {
    Object.assign(this, data);
    this.save = vi.fn().mockResolvedValue({
      _id: validCourseId,
      ...data
    });
  }

  MockCourse.aggregate = mockAggregate;
  MockCourse.findById = mockFindById;
  MockCourse.findByIdAndUpdate = mockFindByIdAndUpdate;

  return {
    MockCourse,
    mockAggregate,
    mockFindById,
    mockFindByIdAndUpdate,
    mockCourseOptionsFindOne,
    mockCourseOptionsCreate,
    mockPostCountDocuments,
    mockCourseMemberFindOne,
    mockCourseMemberCreate
  };
});

vi.mock("../backend/src/models/CourseMember.js", () => ({
  default: {
    findOne: mockCourseMemberFindOne,
    create: mockCourseMemberCreate
  }
}));

vi.mock("../backend/src/models/Course.js", () => ({
  default: MockCourse
}));

vi.mock("../backend/src/models/CourseOptions.js", () => ({
  default: {
    findOne: mockCourseOptionsFindOne,
    create: mockCourseOptionsCreate
  }
}));

vi.mock("../backend/src/models/Post.js", () => ({
  default: {
    countDocuments: mockPostCountDocuments
  }
}));

import Course from "../backend/src/models/Course.js";
import CourseOptions from "../backend/src/models/CourseOptions.js";
import Post from "../backend/src/models/Post.js";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  joinCourse,
  getCourseOptions
} from "../backend/src/controllers/courseController.js";

describe("courseController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCourseMemberCreate.mockResolvedValue({});
  });

  describe("getAllCourses", () => {
    it("should return courses from aggregate", async () => {
      const fakeCourses = [
        { _id: "1", title: "COSC 360", discussionCount: 2 },
        { _id: "2", title: "COSC 315", discussionCount: 0 }
      ];

      Course.aggregate.mockResolvedValue(fakeCourses);

      const req = { query: {} };
      const res = createMockRes();

      await getAllCourses(req, res);

      expect(Course.aggregate).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(fakeCourses);
    });

    it("should build pipeline with q and az sort", async () => {
      Course.aggregate.mockResolvedValue([]);

      const req = {
        query: {
          q: "Computer Science",
          sort: "az"
        }
      };
      const res = createMockRes();

      await getAllCourses(req, res);

      const pipeline = Course.aggregate.mock.calls[0][0];

      expect(pipeline[0]).toEqual({
        $match: {
          $or: [
            { title: { $regex: "Computer Science", $options: "i" } },
            { field: { $regex: "Computer Science", $options: "i" } },
            { type: { $regex: "Computer Science", $options: "i" } },
            { tags: { $elemMatch: { $regex: "Computer Science", $options: "i" } } }
          ]
        }
      });

      expect(pipeline.some(step => step.$sort && step.$sort.title === 1)).toBe(true);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getCourseById", () => {
    it("should return 404 if course is not found", async () => {
      Course.findById.mockResolvedValue(null);

      const req = { params: { id: validCourseId } };
      const res = createMockRes();

      await getCourseById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Course not found" });
    });

    it("should return course with discussionCount", async () => {
      Course.findById.mockResolvedValue({
        _id: "course1",
        title: "COSC 360",
        toObject() {
          return {
            _id: "course1",
            title: "COSC 360"
          };
        }
      });

      Post.countDocuments.mockResolvedValue(3);

      const req = { params: { id: validCourseId } };
      const res = createMockRes();

      await getCourseById(req, res);

      expect(Post.countDocuments).toHaveBeenCalledWith({ course: validCourseId });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        _id: "course1",
        title: "COSC 360",
        discussionCount: 3
      });
    });
  });

  describe("createCourse", () => {
    it("should return 400 when required fields are missing", async () => {
      const req = {
        body: {
          title: "COSC 360"
        },
        user: { userId: validUserId }
      };
      const res = createMockRes();

      await createCourse(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Missing required fields"
      });
    });

    it("should return 400 when course options are not set", async () => {
      CourseOptions.findOne.mockResolvedValue(null);

      const req = {
        body: {
          title: "COSC 360",
          type: "Lecture",
          field: "Computer Science",
          description: "Web programming"
        },
        user: { userId: validUserId }
      };
      const res = createMockRes();

      await createCourse(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Course options not set up yet"
      });
    });

    it("should return 400 for invalid type", async () => {
      CourseOptions.findOne.mockResolvedValue({
        types: ["Lab", "Seminar"],
        fields: ["Computer Science"],
        tags: ["React", "Frontend"]
      });

      const req = {
        body: {
          title: "COSC 360",
          type: "Lecture",
          field: "Computer Science",
          description: "Web programming"
        },
        user: { userId: validUserId }
      };
      const res = createMockRes();

      await createCourse(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Invalid course type"
      });
    });

    it("should return 400 for invalid tag", async () => {
      CourseOptions.findOne.mockResolvedValue({
        types: ["Lecture"],
        fields: ["Computer Science"],
        tags: ["React", "Frontend"]
      });

      const req = {
        body: {
          title: "COSC 360",
          type: "Lecture",
          field: "Computer Science",
          description: "Web programming",
          tags: ["AI"]
        },
        user: { userId: validUserId }
      };
      const res = createMockRes();

      await createCourse(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "One or more tags are invalid"
      });
    });

    it("should create course successfully with valid input", async () => {
      CourseOptions.findOne.mockResolvedValue({
        types: ["Lecture"],
        fields: ["Computer Science"],
        tags: ["React", "Frontend"]
      });

      const req = {
        body: {
          title: "COSC 360",
          type: "Lecture",
          field: "Computer Science",
          description: "Web programming",
          location: "EME 2181",
          tags: ["React"]
        },
        user: { userId: validUserId }
      };
      const res = createMockRes();

      await createCourse(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("COSC 360");
      expect(res.body.createdBy).toBe(validUserId);
      expect(res.body.memberCount).toBe(0);
      expect(res.body._id).toBe(validCourseId);
    });
  });

  describe("joinCourse", () => {
    it("should return 404 if course is not found", async () => {
      mockCourseMemberFindOne.mockResolvedValue(null);
      Course.findByIdAndUpdate.mockResolvedValue(null);

      const req = {
        params: { id: validCourseId },
        user: { userId: validUserId }
      };
      const res = createMockRes();

      await joinCourse(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Course not found" });
    });

    it("should increase memberCount and return success", async () => {
      mockCourseMemberFindOne.mockResolvedValue(null);
      Course.findByIdAndUpdate.mockResolvedValue({
        _id: validCourseId,
        memberCount: 5
      });

      const req = {
        params: { id: validCourseId },
        user: { userId: validUserId }
      };
      const res = createMockRes();

      await joinCourse(req, res);

      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        validCourseId,
        { $inc: { memberCount: 1 } },
        { new: true }
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: "Joined successfully",
        memberCount: 5
      });
    });

    it("should return 500 when database throws error", async () => {
      mockCourseMemberFindOne.mockResolvedValue(null);
      Course.findByIdAndUpdate.mockRejectedValue(new Error("db failed"));

      const req = {
        params: { id: validCourseId },
        user: { userId: validUserId }
      };
      const res = createMockRes();

      await joinCourse(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Failed to join course");
      expect(res.body.error).toBe("db failed");
    });
  });

  describe("getCourseOptions", () => {
    it("should return existing options when found", async () => {
      CourseOptions.findOne.mockResolvedValue({
        types: ["Lecture"],
        fields: ["Computer Science"],
        tags: ["React"]
      });

      const req = {};
      const res = createMockRes();

      await getCourseOptions(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        types: ["Lecture"],
        fields: ["Computer Science"],
        tags: ["React"]
      });
    });

    it("should create default options when none exist", async () => {
      CourseOptions.findOne.mockResolvedValue(null);
      CourseOptions.create.mockResolvedValue({
        types: ["Bootcamp", "Lab", "Lecture", "Seminar", "Tutorial", "Workshop"],
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

      const req = {};
      const res = createMockRes();

      await getCourseOptions(req, res);

      expect(CourseOptions.create).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      expect(res.body.types).toContain("Lecture");
      expect(res.body.fields).toContain("Computer Science");
      expect(res.body.tags).toContain("React");
    });
  });
});