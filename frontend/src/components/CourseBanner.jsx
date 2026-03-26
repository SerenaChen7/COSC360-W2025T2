import backgroundImg from "../assets/Background.png";
import courseImg from "../assets/Course.png";
import "./CourseBanner.css";

function CourseBanner({ course }) {
  const tags = course
    ? [course.field, course.type, ...(course.tags || [])].filter(Boolean)
    : [];

  return (
    <section
      className="course-banner"
      style={{ backgroundImage: `url(${courseImg})` }}
    >
      <div
        className="course-banner-overlay"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      ></div>

      <div className="course-banner-content">
        <div className="course-banner-left">
          <h1>{course ? `${course.title} ⭐` : "Loading..."}</h1>

          <p>{course?.description || "Loading course description..."}</p>

          <div className="course-banner-tags">
            {tags.map((tag, index) => (
              <span key={index} className="course-banner-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="course-banner-right">
          <p>◌ Active Today • 167 Members</p>
          <p>◎ {course?.location || "Remote + Campus"}</p>
          <p>▣ Open to Join</p>
        </div>
      </div>
    </section>
  );
}

export default CourseBanner;