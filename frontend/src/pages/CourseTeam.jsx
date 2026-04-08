import Header from "../components/Header";
import Navbar from "../components/Navbar";
import CourseBanner from "../components/CourseBanner";
import ProjectTabs from "../components/ProjectTabs";
import "./CourseTeam.css";
import AdminActions from "../components/AdminActions";
import removeIcon from "../assets/remove.png";
import { useEffect, useState } from "react";

function CourseTeam({ setPage, role, courseId, currentUser, setCurrentUser, setRole }) {
  const [course, setCourse] = useState(null);
  const [creator, setCreator] = useState(null);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [managingMembers, setManagingMembers] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchJoinedStatus = async () => {
    if (!courseId) return;
    if (role !== "user" && role !== "admin") {
      setIsJoined(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setIsJoined(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/courses/joined`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch joined courses");
      }

      const data = await res.json();
      const joinedIds = (data || []).map((course) => String(course._id));
      setIsJoined(joinedIds.includes(String(courseId)));
    } catch (err) {
      console.error(err);
      setIsJoined(false);
    }
  };

  const fetchMembers = (id) => {
    if (!id) return;
    fetch(`${API_URL}/api/courses/${id}/members`)
      .then((res) => res.json())
      .then((data) => {
        setCreator(data.creator || null);
        setMembers(data.members || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!courseId) return;

    fetch(`${API_URL}/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourse(data))
      .catch((err) => console.error(err));

    fetchMembers(courseId);
    fetchJoinedStatus();
  }, [courseId, role]);

  const handleRemoveMember = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/members/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove member");
      setCourse((prev) => prev ? { ...prev, memberCount: Math.max(0, prev.memberCount - 1) } : prev);
      fetchMembers(courseId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async () => {
    if (!courseId) return;
    setJoining(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/leave`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to leave");

      setIsJoined(false);
      setCourse((prev) =>
        prev ? { ...prev, memberCount: data.memberCount } : prev
      );
      fetchMembers(courseId);
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  const handleJoin = async () => {
    if (!courseId) return;
    setJoining(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join");

      setIsJoined(true);
      setCourse((prev) =>
        prev ? { ...prev, memberCount: data.memberCount } : prev
      );
      fetchMembers(courseId);
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  const filteredMembers = members.filter((m) =>
    m.userId?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="course-team-page">
      <Header />
      <Navbar
        setPage={setPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setRole={setRole}
      />

      <div className="course-team-hero">
        <CourseBanner course={course} />
      </div>

      <div className="course-team-tabs">
        <ProjectTabs activeTab="team" setPage={setPage} />
      </div>

      <main className="course-team-content">
        <section className="course-team-main">
          <div className="team-card">
            <h3>Hub Creator</h3>
            <div className="member-list">
              {creator ? (
                <div className="member-row">
                  <div className="member-avatar">
                    {creator.profileImage ? (
                      <img
                        src={`${API_URL}${creator.profileImage}`}
                        alt={creator.username}
                        className="member-avatar-img"
                      />
                    ) : (
                      creator.username?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="member-info">
                    <p className="member-name">{creator.username}</p>
                    <p className="member-role">Creator</p>
                    <p className="member-detail">{creator.email}</p>
                  </div>
                </div>
              ) : (
                <p className="member-detail">No creator info available.</p>
              )}
            </div>
          </div>

          <div className="team-card">
            <h3>Current Members ({members.length})</h3>
            <input
              className="member-search"
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="member-list">
              {filteredMembers.length === 0 ? (
                <p className="member-detail">No members found.</p>
              ) : (
                filteredMembers.map((m) => (
                  <div className="member-row" key={m._id}>
                    <div className="member-avatar">
                      {m.userId?.profileImage ? (
                        <img
                          src={`${API_URL}${m.userId.profileImage}`}
                          alt={m.userId?.username}
                          className="member-avatar-img"
                        />
                      ) : (
                        m.userId?.username?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="member-info">
                      <p className="member-name">{m.userId?.username}</p>
                      <p className="member-role">{m.roleInCourse}</p>
                      <p className="member-detail">{m.userId?.email}</p>
                    </div>
                    {role === "admin" && managingMembers && (
                      <button
                        className="remove-icon-button"
                        title="Remove member"
                        onClick={() => handleRemoveMember(m.userId?._id)}
                      >
                        <img src={removeIcon} alt="Remove" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside className="course-team-sidebar">
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
                ➤ Log in to Join
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
              managingMembers={managingMembers}
              onToggleManage={() => setManagingMembers((prev) => !prev)}
            />
          )}
        </aside>
      </main>
    </div>
  );
}

export default CourseTeam;
