import Header from "../components/Header";
import Navbar from "../components/Navbar";
import CourseBanner from "../components/CourseBanner";
import ProjectTabs from "../components/ProjectTabs";
import "./CourseTeam.css";
import AdminActions from "../components/AdminActions";
import removeIcon from "../assets/remove.png";
import { useEffect, useState } from "react";

function CourseTeam({ setPage , role, courseId }) {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetch(`http://localhost:3000/api/courses/${courseId}`)
        .then((res) => res.json())
        .then((data) => setCourse(data))
        .catch((err) => console.error(err));
      return;
    }

    fetch("http://localhost:3000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourse(data[0]))
      .catch((err) => console.error(err));
  }, [courseId]);

  const instructors = [
    {
      name: "Jacob Liu",
      role: "Instructor",
      detail: "Course coordinator • Web development"
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Student",
      detail: "Frontend and UI collaboration"
    },
    {
      name: "Daniel Kim",
      role: "Student",
      detail: "Backend API integration"
    },
    {
      name: "Emily Wong",
      role: "Student",
      detail: "Testing and documentation"
    },
    {
      name: "Michael Lee",
      role: "Student",
      detail: "Discussion moderation support"
    }
  ];

  return (
    <div className="course-team-page">
      <Header />
      <Navbar />

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
              {instructors.map((member, index) => (
                <div className="member-row" key={index}>
                    <div className="member-avatar">{member.name.charAt(0)}</div>

                    <div className="member-info">
                        <p className="member-name">{member.name}</p>
                        <p className="member-role">{member.role}</p>
                        <p className="member-detail">{member.detail}</p>
                    </div>

                    {role === "admin" && (
                        <button className="remove-icon-button" title="Remove member">
                        <img src={removeIcon} alt="Remove" />
                        </button>
                    )}
                </div>
              ))}
            </div>
          </div>

          <div className="team-card">
            <h3>Current Members</h3>
            <div className="member-list">
              {teamMembers.map((member, index) => (
                <div className="member-row" key={index}>
                  <div className="member-avatar">
                    {member.name.charAt(0)}
                  </div>
                  <div className="member-info">
                    <p className="member-name">{member.name}</p>
                    <p className="member-role">{member.role}</p>
                    <p className="member-detail">{member.detail}</p>
                  </div>
                  {role === "admin" && (
                        <button className="remove-icon-button" title="Remove member">
                        <img src={removeIcon} alt="Remove" />
                        </button>
                    )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="course-team-sidebar">
          <div className="join-card">
            <h3>Join This Hub</h3>
            <p className="join-subtitle">Ready to join?</p>
            <p>
              Become part of the community to participate in discussions,
              access shared resources, and stay updated on course discussions.
            </p>
            {role === "guest" && (
              <button className="join-button">➤ Log in to Join</button>
            )}
            {role === "user" && (
              <button className="join-button">➤ Join Course</button>
            )}
          </div>
          {role === "admin" && <AdminActions />}
        </aside>
      </main>
    </div>
  );
}

export default CourseTeam;