import Header from "../components/Header";
import Navbar from "../components/Navbar";
import CourseBanner from "../components/CourseBanner";
import ProjectTabs from "../components/ProjectTabs";
import "./CourseOverview.css";
import AdminActions from "../components/AdminActions";
import { useEffect, useState } from "react";

function CourseOverview({ setPage, role, courseId }) {
  const [course, setCourse] = useState(null);

  const [isJoined, setIsJoined] = useState(() => {
    try {
      const ids = JSON.parse(localStorage.getItem("joinedCourseIds")) || [];
      return ids.includes(courseId);
    } catch {
      return false;
    }
  });
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    if (!courseId) return;
    setJoining(true);
    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}/join`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to join");
      const ids = JSON.parse(localStorage.getItem("joinedCourseIds")) || [];
      if (!ids.includes(courseId)) {
        localStorage.setItem("joinedCourseIds", JSON.stringify([...ids, courseId]));
      }
      setIsJoined(true);
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetch(`http://localhost:3000/api/courses/${courseId}`)
        .then(res => res.json())
        .then(data => setCourse(data))
        .catch(err => console.error(err));
      return;
    }

    fetch("http://localhost:3000/api/courses")
      .then(res => res.json())
      .then(data => setCourse(data[0]))
      .catch(err => console.error(err));
  }, [courseId]);

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
        <CourseBanner course={course} />
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
          {!isJoined && (
            <div className="join-card">
              <h3>Join This Hub</h3>
              <p className="join-subtitle">Ready to join?</p>
              <p>
                Become part of the community to participate in discussions,
                access shared resources, and stay updated on course discussions.
              </p>
              {role === "guest" && <button className="join-button">➤ Login to Join</button>}
              {role === "user" && (
                <button className="join-button" onClick={handleJoin} disabled={joining}>
                  ➤ {joining ? "Joining..." : "Join Course"}
                </button>
              )}
            </div>
          )}
          {role === "admin" && <AdminActions />}
        </aside>
      </main>
    </div>
  );
}

export default CourseOverview;