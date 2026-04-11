import { describe, expect, it } from "vitest";
import { formatCourseTerm, getCourseStatus } from "./courseDisplay.js";

describe("courseDisplay utils", () => {
  it("should mark courses without an end date as ongoing", () => {
    expect(getCourseStatus({})).toEqual({
      label: "Ongoing",
      variant: "ongoing"
    });
  });

  it("should mark past courses as done", () => {
    const status = getCourseStatus(
      { endDate: "2025-01-01T12:00:00.000Z" },
      new Date("2025-02-01T12:00:00.000Z")
    );

    expect(status).toEqual({
      label: "Done",
      variant: "done"
    });
  });

  it("should format a bounded course term", () => {
    expect(
      formatCourseTerm({
        startDate: "2026-01-15T12:00:00.000Z",
        endDate: "2026-04-20T12:00:00.000Z"
      })
    ).toBe("Jan 2026 - Apr 2026");
  });

  it("should format an open-ended course term", () => {
    expect(
      formatCourseTerm({
        startDate: "2026-01-15T12:00:00.000Z"
      })
    ).toBe("From Jan 2026");
  });
});
