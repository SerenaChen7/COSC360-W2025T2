import backgroundImg from "../assets/Background.png";
import courseImg from "../assets/Course.png";
import "./CourseBanner.css";

const API_URL = import.meta.env.VITE_API_URL;

function CourseBanner({ course, isFavorite }) {
  const tags = course
    ? [course.field, course.type, ...(course.tags || [])].filter(Boolean)
    : [];

  const bannerImage = course?.thumbnail
    ? `${API_URL}${course.thumbnail}`
    : courseImg;

  return (
    <section
      className="course-banner"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div
        className="course-banner-overlay"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      ></div>

      <div className="course-banner-content">
        <div className="course-banner-left">
          <h1>{course ? `${course.title}${isFavorite ? " ⭐" : ""}` : "Loading..."}</h1>

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