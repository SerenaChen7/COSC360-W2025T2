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

export default function Dashboard({ setPage, setSelectedCourseId }) {
  const [joinedIds, setJoinedIds] = useState(getJoinedIds);
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch details for all joined courses
  useEffect(() => {
    if (joinedIds.length === 0) {
      setJoinedCourses([]);
      return;
    }
    setLoadingCourses(true);
    Promise.all(
      joinedIds.map((id) =>
        fetch(`http://localhost:3000/api/courses/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    )
      .then((results) => setJoinedCourses(results.filter(Boolean)))
      .finally(() => setLoadingCourses(false));
  }, [joinedIds]);

  const handleJoined = (courseId) => {
    setJoinedIds((prev) => {
      if (prev.includes(courseId)) return prev;
      const next = [...prev, courseId];
      saveJoinedIds(next);
      return next;
    });
  };

  const handleLeave = (courseId) => {
    setJoinedIds((prev) => {
      const next = prev.filter((id) => id !== courseId);
      saveJoinedIds(next);
      return next;
    });
    setJoinedCourses((prev) => prev.filter((c) => c._id !== courseId));
  };

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    setPage("course");
  };

  return (
    <>
      <Header />
      <Navbar setPage={setPage} />

      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-heading">My Dashboard</h1>
            <p className="dashboard-subheading">Manage and browse your course hubs</p>
          </div>
          <button className="dashboard-join-btn" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Join Course
          </button>
        </div>

        <section className="dashboard-section">
          <h2 className="dashboard-section-title">MY COURSES</h2>

          {loadingCourses ? (
            <p className="dashboard-empty">Loading your courses...</p>
          ) : joinedCourses.length === 0 ? (
            <div className="dashboard-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c0ccd8" strokeWidth="1.5">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              <p>You haven't joined any courses yet.</p>
              <button className="dashboard-join-btn" onClick={() => setShowModal(true)}>
                Browse &amp; Join Courses
              </button>
            </div>
          ) : (
            <div className="dashboard-courses-grid">
              {joinedCourses.map((course) => {
                const status = getStatus(course.duration);
                const term = formatTerm(course.duration);
                return (
                  <div
                    key={course._id}
                    className="dc-card"
                    onClick={() => handleCourseClick(course._id)}
                  >
                    <div className="dc-card-inner">
                      <div className="dc-top">
                        <div className="dc-info">
                          <h3 className="dc-title">{course.title}</h3>
                          {term && <p className="dc-term">{term}</p>}
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
                        <span className={`dc-status dc-status--${status === "Ongoing" ? "ongoing" : "done"}`}>
                          <span className="dc-status-dot" /> {status}
                        </span>
                      </div>

                      <div className="dc-stats">
                        <span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          {course.memberCount ?? 0} Members
                        </span>
                        {course.location && (
                          <span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {course.location}
                          </span>
                        )}
                      </div>

                      <div className="dc-actions">
                        <button
                          className="dc-view-btn"
                          onClick={() => handleCourseClick(course._id)}
                        >
                          View Course
                        </button>
                        <button
                          className="dc-leave-btn"
                          onClick={(e) => { e.stopPropagation(); handleLeave(course._id); }}
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
