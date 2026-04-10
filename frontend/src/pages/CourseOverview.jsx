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
  const [requestStatus, setRequestStatus] = useState(null); // 'pending', 'accepted', or 'rejected'
  const [joining, setJoining] = useState(false);
  const token = localStorage.getItem("token");

  // Format date helper
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Sync joined status with localStorage
  const [isJoined, setIsJoined] = useState(() => {
    try {
      const ids = JSON.parse(localStorage.getItem("joinedCourseIds")) || [];
      return ids.includes(courseId);
    } catch {
      return false;
    }
  });

  // Fetch course data and recent posts
  useEffect(() => {
    if (!courseId) return;

    // Get Course details
    fetch(`http://localhost:3000/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error(err));

    // Get recent discussions
    fetch(`http://localhost:3000/api/courses/${courseId}/posts`)
      .then((res) => res.json())
      .then((data) => setRecentPosts(data.slice(0, 3)))
      .catch((err) => console.error(err));

    // Check if user has an existing request for this course
    if (token && role === "user") {
      fetch("http://localhost:3000/api/requests", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const match = data.find(r => r.course?._id === courseId);
          if (match) {
            setRequestStatus(match.status);
          }
        })
        .catch(err => console.error(err));
    }
  }, [courseId, token, role]);

  // Handle the join request
  const handleJoin = async () => {
    if (!courseId || !token) return;
    setJoining(true);

    try {
      // Send request to the new actionRoutes endpoint
      const res = await fetch(`http://localhost:3000/api/join/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send request");
      }

      // Update UI to show pending status
      setRequestStatus('pending');
      
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setJoining(false);
    }
  };

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
              <li>
                Status: {isJoined ? "Joined" : requestStatus === 'pending' ? "Pending Approval" : "Open to Join"}
              </li>
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
              {isJoined ? "You are already a member" : requestStatus === 'pending' ? "Request Sent" : "Ready to join?"}
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

            {role === "user" && (
              isJoined ? (
                <button className="join-button" disabled>
                  ✓ Joined
                </button>
              ) : requestStatus === 'pending' ? (
                <button className="join-button" style={{ backgroundColor: '#6c757d' }} disabled>
                  ⌛ Pending
                </button>
              ) : (
                <button className="join-button" onClick={handleJoin} disabled={joining}>
                  ➤ {joining ? "Sending Request..." : "Join Course"}
                </button>
              )
            )}

            {role === "admin" && (
              <button className="join-button" disabled style={{ backgroundColor: '#0b2d5c' }}>
                Admin View
              </button>
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