import Header from "../components/Header";
import Navbar from "../components/Navbar";
import CourseBanner from "../components/CourseBanner";
import ProjectTabs from "../components/ProjectTabs";
import "./CourseOverview.css";
import AdminActions from "../components/AdminActions";
import { useEffect, useState } from "react";

function CourseOverview({ setPage, role, courseId, currentUser, setCurrentUser, setRole }) {
  const [course, setCourse] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!courseId) return;

    fetch(`http://localhost:3000/api/courses/${courseId}/posts`)
      .then((res) => res.json())
      .then((data) => setRecentPosts(data.slice(0, 3)))
      .catch((err) => console.error(err));
  }, [courseId]);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const [isJoined, setIsJoined] = useState(() => {
    try {
      const ids = JSON.parse(localStorage.getItem("joinedCourseIds")) || [];
      return ids.includes(courseId);
    } catch {
      return false;
    }
  });
  const [joining, setJoining] = useState(false);

  // The handleJoin function is responsible for sending a request to the backend to join the course. 
  // It uses the JWT token for authentication and updates the local state and localStorage upon success.
  const handleJoin = async () => {
    if (!courseId) return;
    setJoining(true);
    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join");
      const ids = JSON.parse(localStorage.getItem("joinedCourseIds")) || [];
      if (!ids.includes(courseId)) {
        localStorage.setItem("joinedCourseIds", JSON.stringify([...ids, courseId]));
      }
      setIsJoined(true);
      setCourse((prev) => prev ? { ...prev, memberCount: data.memberCount } : prev);
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!courseId) return;
    setJoining(true);
    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}/leave`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to leave");
      const ids = JSON.parse(localStorage.getItem("joinedCourseIds")) || [];
      localStorage.setItem("joinedCourseIds", JSON.stringify(ids.filter((id) => id !== courseId)));
      setIsJoined(false);
      setCourse((prev) => prev ? { ...prev, memberCount: data.memberCount } : prev);
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
      <Navbar
        setPage={setPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setRole={setRole}
      />

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
                  ? course.duration.startDate.split("T")[0]
                  : "TBA"}
              </li>
              <li>
                End Date:{" "}
                {course?.duration?.endDate
                  ? course.duration.endDate.split("T")[0]
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
              <li>Status: {isJoined ? "Joined" : "Open to Join"}</li>
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
                      background: "#0b2d5c",
                      color: "#ffffff",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          <div className="overview-card">
            <h3>Recent Discussions</h3>
            {recentPosts.length === 0 ? (
              <p className="overview-empty">No discussion yet.</p>
            ) : (
              <div className="overview-recent-list">
                {recentPosts.map((post) => (
                  <div key={post._id} className="overview-recent-item">
                    <p className="overview-recent-author">
                      {post.author?.username || "User"} · {formatTime(post.createdAt)}
                    </p>
                    <p className="overview-recent-text">
                      {post.text || "Shared attachments"}
                    </p>
                  </div>
                ))}
                <button
                  className="overview-link-button"
                  onClick={() => setPage("course-discussion")}
                >
                  View all discussions
                </button>
              </div>
            )}
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
              <button className="join-button" onClick={() => setPage("login")}>
                ➤ Login to Join
              </button>
            )}

            {(role === "user" || role === "admin") && (
              isJoined ? (
                <button className="join-button leave-button" onClick={handleLeave} disabled={joining}>
                  {joining ? "Leaving..." : "✕ Leave Course"}
                </button>
              ) : (
                <button className="join-button" onClick={handleJoin} disabled={joining}>
                  ➤ {joining ? "Joining..." : "Join Course"}
                </button>
              )
            )}
          </div>

          {role === "admin" && (
            <AdminActions
              courseId={courseId}
              course={course}
              onCourseUpdated={(updated) => setCourse((prev) => ({ ...prev, ...updated }))}
            />
          )}

        </aside>
      </main>
    </div>
  );
}

export default CourseOverview;