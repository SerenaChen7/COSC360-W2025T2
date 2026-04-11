import { describe, expect, it } from "vitest";
import { getDisplayedJoinableCourses } from "./joinCourseFilters.js";

const courses = [
  {
    _id: "c1",
    title: "COSC 360",
    field: "Computer Science",
    type: "Lecture",
    tags: ["React", "Frontend"],
    memberCount: 12
  },
  {
    _id: "c2",
    title: "STAT 230",
    field: "Statistics",
    type: "Workshop",
    tags: ["Data"],
    memberCount: 7
  },
  {
    _id: "c3",
    title: "MATH 200",
    field: "Mathematics",
    type: "Lecture",
    tags: ["Algebra"],
    memberCount: 20
  }
];

describe("joinCourseFilters", () => {
  it("should exclude courses the user already joined", () => {
    const displayed = getDisplayedJoinableCourses(courses, ["c2"]);

    expect(displayed.map((course) => course._id)).toEqual(["c1", "c3"]);
  });

  it("should search across title, field, type, and tags", () => {
    const displayed = getDisplayedJoinableCourses(courses, [], {
      searchValue: "react"
    });

    expect(displayed.map((course) => course._id)).toEqual(["c1"]);
  });

  it("should apply field, type, and sort filters together", () => {
    const displayed = getDisplayedJoinableCourses(courses, [], {
      fieldFilter: ["Mathematics", "Computer Science"],
      typeFilter: ["Lecture"],
      sortFilter: ["most"]
    });

    expect(displayed.map((course) => course._id)).toEqual(["c3", "c1"]);
  });
});
