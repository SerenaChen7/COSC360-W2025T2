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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to join");
      }

      const ids = JSON.parse(localStorage.getItem("joinedCourseIds")) || [];
      if (!ids.includes(courseId)) {
        localStorage.setItem("joinedCourseIds", JSON.stringify([...ids, courseId]));
      }

      setIsJoined(true);

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              memberCount: data.memberCount
            }
          : prev
      );
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
            <h3>About This Course</h3>
            <p>{course?.description || "No description available."}</p>
          </div>

          <div className="overview-card">
            <h3>Course Info</h3>
            <ul>
              <li>
                Start Date:{" "}
                {course?.duration?.startDate
                  ? new Date(course.duration.startDate).toLocaleDateString()
                  : "TBA"}
              </li>
              <li>
                End Date:{" "}
                {course?.duration?.endDate
                  ? new Date(course.duration.endDate).toLocaleDateString()
                  : "TBA"}
              </li>
              <li>Location: {course?.location || "TBA"}</li>
              <li>Field: {course?.field || "TBA"}</li>
              <li>Type: {course?.type || "TBA"}</li>
            </ul>
          </div>

          <div className="overview-card">
            <h3>Course Stats</h3>
            <ul>
              <li>Members: {course?.memberCount ?? 0}</li>
              <li>Discussions: {course?.discussionCount || 0}</li>
              <li>Status: Open to Join</li>
            </ul>
          </div>

          <div className="overview-card">
            <h3>Course Tags</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[course?.field, course?.type, ...(course?.tags || [])]
                .filter(Boolean)
                .map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "6px 12px",
                      background: "#1f2a44",
                      borderRadius: "12px",
                      fontSize: "12px"
                    }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </section>

        <aside className="course-overview-sidebar">
          <div className="join-card">
            <h3>Join This Hub</h3>
            <p className="join-subtitle">
              {isJoined ? "You are already a member" : "Ready to join?"}
            </p>
            <p>
              Become part of the community to participate in discussions,
              access shared resources, and stay updated on course discussions.
            </p>

            {role === "guest" && (
              <button className="join-button">➤ Login to Join</button>
            )}

            {role === "user" &&
              (isJoined ? (
                <button className="join-button" disabled>
                  ✓ Joined
                </button>
              ) : (
                <button className="join-button" onClick={handleJoin} disabled={joining}>
                  ➤ {joining ? "Joining..." : "Join Course"}
                </button>
              ))}

            {role === "admin" && (
              <button className="join-button" disabled>
                Admin View
              </button>
            )}
          </div>

          {role === "admin" && <AdminActions courseId={courseId} />}
        </aside>
      </main>
    </div>
  );
}

export default CourseOverview;