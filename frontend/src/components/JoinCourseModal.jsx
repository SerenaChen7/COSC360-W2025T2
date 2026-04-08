import { useState, useEffect, useMemo } from "react";
import Filter from "./Filter";
import "./JoinCourseModal.css";

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

const SORT_OPTIONS = [
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "most", label: "Most Members" },
  { value: "least", label: "Least Members" },
];

export default function JoinCourseModal({ onClose, onJoined, joinedIds, setPage, setSelectedCourseId }) {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [fieldFilter, setFieldFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [sortFilter, setSortFilter] = useState([]);
  const [joiningId, setJoiningId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => {
        setAllCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fieldOptions = useMemo(() => {
    const fields = [...new Set(allCourses.map((c) => c.field).filter(Boolean))].sort();
    return fields.map((f) => ({ value: f, label: f }));
  }, [allCourses]);

  const typeOptions = useMemo(() => {
    const types = [...new Set(allCourses.map((c) => c.type).filter(Boolean))].sort();
    return types.map((t) => ({ value: t, label: t }));
  }, [allCourses]);

  const displayed = useMemo(() => {
    let courses = allCourses.filter((c) => !joinedIds.includes(c._id));

    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.field?.toLowerCase().includes(q) ||
          c.type?.toLowerCase().includes(q) ||
          c.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (fieldFilter.length > 0) {
      courses = courses.filter((c) => fieldFilter.includes(c.field));
    }

    if (typeFilter.length > 0) {
      courses = courses.filter((c) => typeFilter.includes(c.type));
    }

    if (sortFilter[0] === "az") courses = [...courses].sort((a, b) => a.title.localeCompare(b.title));
    else if (sortFilter[0] === "za") courses = [...courses].sort((a, b) => b.title.localeCompare(a.title));
    else if (sortFilter[0] === "most") courses = [...courses].sort((a, b) => b.memberCount - a.memberCount);
    else if (sortFilter[0] === "least") courses = [...courses].sort((a, b) => a.memberCount - b.memberCount);

    return courses;
  }, [allCourses, joinedIds, searchValue, fieldFilter, typeFilter, sortFilter]);

  const handleJoin = async (e, courseId) => {
    e.stopPropagation();
    setJoiningId(courseId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to join");
      const data = await res.json();
      setAllCourses((prev) =>
        prev.map((c) => (c._id === courseId ? { ...c, memberCount: data.memberCount } : c))
      );
      onJoined(courseId);
    } catch (err) {
      console.error(err);
    } finally {
      setJoiningId(null);
    }
  };

  const handleCardClick = (courseId) => {
    setSelectedCourseId(courseId);
    setPage("course");
    onClose();
  };

  return (
    <div className="jcm-overlay" onClick={onClose}>
      <div className="jcm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="jcm-header">
          <h2 className="jcm-title">Join Course</h2>
          <button className="jcm-close" onClick={onClose}>✕</button>
        </div>

        {/* Filters + Search */}
        <div className="jcm-toolbar">
          <div className="jcm-filters">
            <Filter label="Field" options={fieldOptions} selectedValues={fieldFilter} onChange={setFieldFilter} />
            <Filter label="Type" options={typeOptions} selectedValues={typeFilter} onChange={setTypeFilter} />
            <Filter label="Sort" options={SORT_OPTIONS} selectedValues={sortFilter} onChange={setSortFilter} singleSelect />
          </div>
          <div className="jcm-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Course List */}
        <div className="jcm-list">
          {loading ? (
            <p className="jcm-empty">Loading...</p>
          ) : displayed.length === 0 ? (
            <p className="jcm-empty">No courses available to join.</p>
          ) : (
            displayed.map((course) => {
              const status = getStatus(course.duration);
              const term = formatTerm(course.duration);
              return (
                <div key={course._id} className="jcm-card" onClick={() => handleCardClick(course._id)}>
                  <div className="jcm-card-body">
                    <div className="jcm-card-top">
                      <div>
                        <h3 className="jcm-card-title">{course.title}</h3>
                        {term && <p className="jcm-card-term">{term}</p>}
                        {/* Top row: type + field */}
                        <div className="jcm-tags">
                          {course.type && <span className="jcm-tag jcm-tag--filled">{course.type}</span>}
                          {course.field && <span className="jcm-tag jcm-tag--filled">{course.field}</span>}
                        </div>
                        {/* Bottom row: user tags */}
                        {course.tags?.length > 0 && (
                          <div className="jcm-tags">
                            {course.tags.map((tag) => (
                              <span key={tag} className="jcm-tag jcm-tag--outline">{tag}</span>
                            ))}
                          </div>
                        )}
                        {/* Stats */}
                        <div className="jcm-stats">
                          <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            {course.discussionCount ?? 0} Discussions
                          </span>
                          <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            {course.memberCount ?? 0} Members
                          </span>
                        </div>
                      </div>
                      <span className={`jcm-status jcm-status--${status === "Ongoing" ? "ongoing" : "done"}`}>
                        <span className="jcm-status-dot" /> {status}
                      </span>
                    </div>
                  </div>
                  <div className="jcm-card-actions">
                    <button
                      className="jcm-join-btn"
                      onClick={(e) => handleJoin(e, course._id)}
                      disabled={joiningId === course._id}
                    >
                      {joiningId === course._id ? "Joining..." : "+ Join Course"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="jcm-footer">
          <button className="jcm-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
