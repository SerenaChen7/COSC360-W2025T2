import Header from "../components/Header";
import Navbar from "../components/Navbar";
import CourseBanner from "../components/CourseBanner";
import ProjectTabs from "../components/ProjectTabs";
import "./CourseOverview.css";

function CourseOverview({ setPage }) {
  const guidelines = [
    "Be respectful and constructive.",
    "Do not share solutions that violate academic integrity policies.",
    "No spam or unrelated advertising."
  ];

  const schedule = [
    "Assignment 2 Q&A – Oct 15, 7:00 PM (Zoom)",
    "Zoom link: https://app.zoom.us/wc/79072424895/start",
    "Midterm Review – Oct 22, 6:00 PM (Room SCI 234)",
    "Project Demo Practice – Nov 5, 5:30 PM (TBA)"
  ];

  const activities = [
    "12 new discussions this week",
    "48 replies in last 7 days",
    "Last post: 2 hours ago"
  ];

  const resources = [
    {
      title: "Week 4 Slides",
      meta: "week4slideswithclicker.pptx (1 attachment)"
    },
    {
      title: "Assignment 1 Guide",
      meta: "file.doc (2 attachments)"
    },
    {
      title: "JavaScript Review Sheet",
      meta: "review.pdf (1 attachment)"
    }
  ];

  return (
    <div className="course-overview-page">
      <Header />
      <Navbar />

      <div className="course-overview-hero">
        <CourseBanner />
      </div>

      <div className="course-overview-tabs">
        <ProjectTabs activeTab="overview" setPage={setPage} />
      </div>

      <main className="course-overview-content">
        <section className="course-overview-main">
          <div className="overview-card">
            <h3>Community Guidelines</h3>
            <ul>
              {guidelines.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="overview-card">
            <h3>Upcoming Schedule</h3>
            <ul>
              {schedule.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="overview-card">
            <h3>Recent Activity</h3>
            <ul>
              {activities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="overview-card">
            <h3>Popular Resources</h3>
            <div className="resource-list">
              {resources.map((resource, index) => (
                <div className="resource-item" key={index}>
                  <p className="resource-title">{resource.title}</p>
                  <p className="resource-meta">{resource.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="course-overview-sidebar">
          <div className="join-card">
            <h3>Join This Hub</h3>
            <p className="join-subtitle">Ready to join?</p>
            <p>
              Become part of the community to participate in discussions,
              access shared resources, and stay updated on course discussions.
            </p>
            <button className="join-button">➤ Log in to Join</button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default CourseOverview;