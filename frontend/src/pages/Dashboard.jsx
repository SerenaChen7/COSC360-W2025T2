import { useState, useEffect } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import JoinCourseModal from "../components/JoinCourseModal";
import "./Dashboard.css";

const JOINED_KEY = "joinedCourseIds";

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

// Check if the course is Ongoing or Done
function getStatus(duration) {
  if (!duration?.endDate) return "Ongoing";
  return new Date(duration.endDate) < new Date() ? "Done" : "Ongoing";
}

// Make the date look like "Winter 2025/2026 Term 2"
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

  // Tab state: "joined" or "requests"
  const [activeTab, setActiveTab] = useState("joined");

  const API_URL = import.meta.env.VITE_API_URL;
  const fetchJoinedCourses = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingCourses(true);
    fetch(`${API_URL}/api/courses/joined`, {
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

  useEffect(() => {
    fetchJoinedCourses();
  }, []);

  const handleJoined = () => {
    fetchJoinedCourses();
  };

  const handleLeave = async (courseId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/leave`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to leave");
      }
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
      <Navbar
        setPage={setPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setRole={setRole}
      />

      <div className="dashboard-page">
        {/* --- HEADER --- */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-heading">Dashboard</h1>
            <p className="dashboard-subheading">Welcome back to your learning hub</p>
          </div>
        </div>

        {/* --- STATS BOXES --- */}
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
          <div className={`stat-card ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
            <div className="stat-icon-wrapper green-bg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <div>
              <span className="stat-number">4</span> 
              <span className="stat-label">Course Requests</span>
            </div>
          </div>
        </div>

        {/* --- CAPSULE TABS --- */}
        <div className="dashboard-tabs-container">
          <button className={`tab-btn ${activeTab === 'joined' ? 'active' : ''}`} onClick={() => setActiveTab('joined')}>
            Courses Joined
          </button>
          <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
            Course Requests
          </button>
        </div>

        {/* --- ACTION BUTTONS --- */}
        {activeTab === "joined" && (
          <div className="dashboard-action-bar" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px' }}>
            {currentUser?.role === "admin" && (
              <button className="dashboard-create-btn" onClick={() => setPage("admin-users")}>Manage Users</button>
            )}
            <button className="dashboard-create-btn" onClick={() => setPage("create")}>+ Create Course</button>
            <button className="dashboard-join-btn" onClick={() => setShowModal(true)}>+ Join New Course</button>
          </div>
        )}

        {/* --- MAIN SECTION --- */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">
            {activeTab === "joined" ? "MY COURSES" : "PENDING REQUESTS"}
          </h2>

          {activeTab === "joined" ? (
            loadingCourses ? (
              <p className="dashboard-empty">Loading...</p>
            ) : joinedCourses.length === 0 ? (
              <div className="dashboard-empty-state">
                <p>You haven't joined any courses yet.</p>
              </div>
            ) : (
              <div className="dashboard-courses-grid">
                {joinedCourses.map((course) => {
                  const status = getStatus(course.duration);
                  const term = formatTerm(course.duration);
                  return (
                    <div key={course._id} className="dc-card" onClick={() => handleCourseClick(course._id)}>
                      <div className="dc-card-inner">
                        <div className="dc-top">
                          <div className="dc-info">
                            <h3 className="dc-title">{course.title}</h3>
                            {term && <p className="dc-term">{term}</p>}
                            
                            {/* Detailed Tags from Serena's design */}
                            <div className="dc-tags">
                              {course.type && <span className="dc-tag dc-tag--filled">{course.type}</span>}
                              {course.field && <span className="dc-tag dc-tag--filled">{course.field}</span>}
                            </div>
                            {course.tags?.length > 0 && (
                              <div className="dc-tags">
                                {course.tags.map((tag) => (
                                  <span key={tag} className="dc-tag dc-tag--outline">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className={`dc-status dc-status--${status === "ongoing" ? "ongoing" : "done"}`}>
                            <span className="dc-status-dot" /> {status}
                          </span>
                        </div>

                        {/* Stats Row from Serena's design */}
                        <div className="dc-stats">
                          <span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            0 Discussions
                          </span>
                          <span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            {course.memberCount ?? 0} Members
                          </span>
                        </div>

                        <div className="dc-actions">
                          <button className="dc-view-btn" onClick={() => handleCourseClick(course._id)}>View Course</button>
                          <button className="dc-leave-btn" onClick={(e) => { e.stopPropagation(); handleLeave(course._id); }}>Leave</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="dashboard-empty-state">
              <p>You have no pending course requests right now.</p>
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