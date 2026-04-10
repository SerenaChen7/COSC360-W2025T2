import { useState, useEffect } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import JoinCourseModal from "../components/JoinCourseModal";
import "./Dashboard.css";

const JOINED_KEY = "joinedCourseIds";

// Local storage helpers
function getJoinedIds() {
  try {
    return JSON.parse(localStorage.getItem(JOINED_KEY)) || [];
  } catch {
    return [];
  }
}

function saveJoinedIds(ids) {
  localStorage.setItem(JOINED_KEY, JSON.stringify(ids));
}

function getStatus(duration) {
  if (!duration?.endDate) return "Ongoing";
  return new Date(duration.endDate) < new Date() ? "Done" : "Ongoing";
}

function formatTerm(duration) {
  if (!duration?.startDate) return null;
  const start = new Date(duration.startDate);
  const end = duration.endDate ? new Date(duration.endDate) : null;
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  return end ? `${fmt(start)} – ${fmt(end)}` : `From ${fmt(start)}`;
}

export default function Dashboard({ setPage, setSelectedCourseId, currentUser, setCurrentUser, setRole }) {
  const [joinedIds, setJoinedIds] = useState(getJoinedIds);
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("joined");

  const savedUserString = localStorage.getItem("user");
  let savedUser = {};
  try {
    savedUser = savedUserString ? JSON.parse(savedUserString) : {};
  } catch (e) {
    console.error("User parse error", e);
  }

  const effectiveRole = (currentUser?.role || savedUser?.role || "").toLowerCase();
  const token = localStorage.getItem("token");

  // Fetch joined courses
  const fetchJoinedCourses = () => {
    if (!token) return;
    setLoadingCourses(true);
    fetch("http://localhost:3000/api/courses/joined", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((courses) => {
        setJoinedCourses(courses);
        const ids = courses.map((c) => c._id);
        setJoinedIds(ids);
        saveJoinedIds(ids);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCourses(false));
  };

  const fetchRequests = () => {
    if (!token) return;
    fetch("http://localhost:3000/api/requests", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Fetch requests failed:", err));
  };

  useEffect(() => {
    fetchJoinedCourses();
    fetchRequests();
  }, []);

  // Update lists when something changes
  const handleJoined = () => {
    // Refresh both lists to ensure data is populated correctly
    fetchJoinedCourses();
    fetchRequests();
  };

  const handleAdminAction = async (requestId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchRequests(); 
        fetchJoinedCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/courses/${courseId}/leave`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to leave");
      fetchJoinedCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    setPage("course");
  };

  return (
    <>
      <Header />
      <Navbar setPage={setPage} currentUser={currentUser} setCurrentUser={setCurrentUser} setRole={setRole} />

      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-heading">Dashboard</h1>
            <p className="dashboard-subheading">Welcome back to your learning hub</p>
          </div>
        </div>

        <div className="dashboard-stats-row">
          <div className={`stat-card ${activeTab === 'joined' ? 'active' : ''}`} onClick={() => setActiveTab('joined')}>
            <div className="stat-icon-wrapper blue-bg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div>
              <span className="stat-number">{joinedIds.length}</span>
              <span className="stat-label">Courses Joined</span>
            </div>
          </div>
          <div className={`stat-card ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => { setActiveTab('requests'); fetchRequests(); }}>
            <div className="stat-icon-wrapper green-bg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <div>
              <span className="stat-number">{requests.filter(r => r.status?.toLowerCase() === 'pending').length}</span> 
              <span className="stat-label">Pending Requests</span>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs-container">
          <button className={`tab-btn ${activeTab === 'joined' ? 'active' : ''}`} onClick={() => setActiveTab('joined')}>My Courses</button>
          {/* Added fetchRequests() on click to ensure list is fresh */}
          <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => { setActiveTab('requests'); fetchRequests(); }}>Course Requests</button>
        </div>

        {activeTab === "joined" && (
          <div className="dashboard-action-bar" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px' }}>
            <button className="dashboard-create-btn" onClick={() => setPage("create")}>+ Create Course</button>
            <button className="dashboard-join-btn" onClick={() => setShowModal(true)}>+ Join New Course</button>
          </div>
        )}

        <section className="dashboard-section">
          <h2 className="dashboard-section-title">
            {activeTab === "joined" ? "MY COURSES" : "COURSE REQUESTS"}
          </h2>

          {activeTab === "joined" ? (
            loadingCourses ? ( <p className="dashboard-empty">Loading...</p> ) : joinedCourses.length === 0 ? (
              <div className="dashboard-empty-state"><p>You haven't joined any courses yet.</p></div>
            ) : (
              <div className="dashboard-courses-grid">
                {joinedCourses.map((course) => (
                  <div key={course._id} className="dc-card" onClick={() => handleCourseClick(course._id)}>
                    <div className="dc-card-inner">
                      <div className="dc-top">
                        <div className="dc-info">
                          <h3 className="dc-title">{course.title}</h3>
                          <div className="dc-tags">
                            {course.type && <span className="dc-tag dc-tag--filled">{course.type}</span>}
                          </div>
                        </div>
                        <span className={`dc-status dc-status--${getStatus(course.duration).toLowerCase()}`}> {getStatus(course.duration)}</span>
                      </div>
                      <div className="dc-stats"><span>{course.memberCount ?? 0} Members</span></div>
                      <div className="dc-actions">
                        <button className="dc-view-btn">View</button>
                        <button className="dc-leave-btn" onClick={(e) => { e.stopPropagation(); handleLeave(course._id); }}>Leave</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="requests-tab-content">
              {requests.length === 0 ? (
                <div className="dashboard-empty-state"><p>No requests found.</p></div>
              ) : (
                <div className="requests-list">
                  {requests.map((req) => (
                    <div key={req._id} className="request-card-item" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0 }}><strong>User:</strong> {req.user?.username || "Unknown"}</p>
                        <p style={{ margin: 0 }}><strong>Course:</strong> {req.course?.title || "Deleted Course"}</p>
                        <p style={{ margin: "5px 0 0 0" }}>Status: <span style={{ fontWeight: 'bold' }}>{(req.status || "pending").toUpperCase()}</span></p>
                      </div>
                      {effectiveRole === "admin" && req.status?.toLowerCase() === "pending" && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }} onClick={() => handleAdminAction(req._id, "accepted")}>Accept</button>
                          <button style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }} onClick={() => handleAdminAction(req._id, "rejected")}>Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <JoinCourseModal
          onClose={() => setShowModal(false)}
          onJoined={handleJoined}
          joinedIds={joinedIds}
          setPage={setPage}
          setSelectedCourseId={setSelectedCourseId}
        />
      )}
    </>
  );
}