import backgroundImg from "../assets/Background.png";
import courseImg from "../assets/Course.png";
import "./CourseBanner.css";

function CourseBanner() {
  const tags = [
    "Computer Science",
    "300 Level",
    "Project Support",
    "Assignment Discussion",
    "Q&A",
    "Frontend Help",
    "Study Group"
  ];

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
          <h1>COSC 360 - Web Programming ⭐</h1>

          <p>
            COSC 360 focuses on modern web development, including frontend
            design, backend integration, and full-stack applications. This hub
            allows students to collaborate on projects, discuss weekly topics,
            and access shared learning resources.
          </p>

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
          <p>◎ Remote + Campus</p>
          <p>▣ Open to Join</p>
        </div>
      </div>
    </section>
  );
}

export default CourseBanner;