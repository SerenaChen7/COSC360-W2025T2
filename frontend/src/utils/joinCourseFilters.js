export function getDisplayedJoinableCourses(
  allCourses,
  joinedIds,
  {
    searchValue = "",
    fieldFilter = [],
    typeFilter = [],
    sortFilter = []
  } = {}
) {
  let courses = allCourses.filter((course) => !joinedIds.includes(course._id));

  if (searchValue.trim()) {
    const query = searchValue.toLowerCase();
    courses = courses.filter(
      (course) =>
        course.title?.toLowerCase().includes(query) ||
        course.field?.toLowerCase().includes(query) ||
        course.type?.toLowerCase().includes(query) ||
        course.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (fieldFilter.length > 0) {
    courses = courses.filter((course) => fieldFilter.includes(course.field));
  }

  if (typeFilter.length > 0) {
    courses = courses.filter((course) => typeFilter.includes(course.type));
  }

  if (sortFilter[0] === "az") {
    return [...courses].sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortFilter[0] === "za") {
    return [...courses].sort((a, b) => b.title.localeCompare(a.title));
  }

  if (sortFilter[0] === "most") {
    return [...courses].sort((a, b) => b.memberCount - a.memberCount);
  }

  if (sortFilter[0] === "least") {
    return [...courses].sort((a, b) => a.memberCount - b.memberCount);
  }

  return courses;
}
