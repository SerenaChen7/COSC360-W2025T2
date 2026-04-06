import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CoverPage from "./pages/CoverPage";
import CourseOverview from "./pages/CourseOverview";
import CourseTeam from "./pages/CourseTeam";
import CourseDiscussion from "./pages/CourseDiscussion";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = useState("cover");
  // here allows the login status to stay consistent across pages.
  const [role, setRole] = useState(savedUser?.role || "guest");
  const [currentUser, setCurrentUser] = useState(savedUser || null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  return (
    <>
      <div style={{ padding: 12 }}>
        <div>
          Set Page:
          <button onClick={() => setPage("cover")} style={{ marginLeft: 8 }}>
            Cover Page
          </button>

          <button onClick={() => setPage("login")} style={{ marginLeft: 8 }}>
            Login
          </button>

          <button onClick={() => setPage("home")} style={{ marginLeft: 8 }}>
            Home
          </button>

          <button onClick={() => setPage("course")} style={{ marginLeft: 8 }}>
            Course Overview
          </button>

          <button onClick={() => setPage("create")} style={{ marginLeft: 8 }}>
            Create Course
          </button>

          <button onClick={() => setPage("dashboard")} style={{ marginLeft: 8 }}>
            Dashboard
          </button>
        </div>

        <div>
          Set Role:
          <button
            onClick={() => setRole("guest")}
            style={{
              marginLeft: 8,
              background: role === "guest" ? "#0b2d5c" : "",
              color: role === "guest" ? "white" : ""
            }}
          >
            Guest
          </button>
          <button
            onClick={() => setRole("user")}
            style={{
              marginLeft: 8,
              background: role === "user" ? "#0b2d5c" : "",
              color: role === "user" ? "white" : ""
            }}
          >
            User
          </button>
          <button
            onClick={() => setRole("admin")}
            style={{
              marginLeft: 8,
              background: role === "admin" ? "#0b2d5c" : "",
              color: role === "admin" ? "white" : ""
            }}
          >
            Admin
          </button>
        </div>
      </div>

      {page === "cover" && (
        <CoverPage setPage={setPage} />
      )}

      {page === "home" && (
        <Home
          setPage={setPage}
          setSelectedCourseId={setSelectedCourseId}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setRole={setRole}
        />
      )}

      {page === "login" && (
        <Login
          setPage={setPage}
          setRole={setRole}
          setCurrentUser={setCurrentUser}
        />
      )}

      {page === "course" && (
        <CourseOverview
          setPage={setPage}
          role={role}
          courseId={selectedCourseId}
          currentUser={currentUser}
        />
      )}

      {page === "course-team" && (
        <CourseTeam
          setPage={setPage}
          role={role}
          courseId={selectedCourseId}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setRole={setRole}
        />
      )}

      {page === "course-discussion" && (
        <CourseDiscussion
          setPage={setPage}
          role={role}
          courseId={selectedCourseId}
          currentUser={currentUser}
        />
      )}
      
      {page === "create" && (
        <>
          <Dashboard
            setPage={setPage}
            setSelectedCourseId={setSelectedCourseId}
            currentUser={currentUser}

          />
          <CreateCourse
            setPage={setPage}
            setSelectedCourseId={setSelectedCourseId}

          />
        </>
      )}
      {page === "dashboard" && (
        <Dashboard
          setPage={setPage}
          setSelectedCourseId={setSelectedCourseId}
        />
      )}
    </>
  );
}