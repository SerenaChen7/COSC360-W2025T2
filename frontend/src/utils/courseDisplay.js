export function getCourseStatus(duration, now = new Date()) {
  if (!duration?.endDate) {
    return {
      label: "Ongoing",
      variant: "ongoing"
    };
  }

  return new Date(duration.endDate) < now
    ? { label: "Done", variant: "done" }
    : { label: "Ongoing", variant: "ongoing" };
}

export function formatCourseTerm(duration, locale = "en-US") {
  if (!duration?.startDate) {
    return null;
  }

  const start = new Date(duration.startDate);
  const end = duration.endDate ? new Date(duration.endDate) : null;
  const fmt = (date) =>
    date.toLocaleDateString(locale, { month: "short", year: "numeric" });

  return end ? `${fmt(start)} - ${fmt(end)}` : `From ${fmt(start)}`;
}
