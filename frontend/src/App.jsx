import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CoverPage  from "./pages/CoverPage";
import Submit from "./pages/Submit";
import CourseOverview from "./pages/CourseOverview";
import CourseTeam from "./pages/CourseTeam";
import CourseDiscussion from "./pages/CourseDiscussion";
import CreateCourse from "./pages/CreateCourse";

export default function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState("user");
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
          <button onClick={() => setPage("submit")} style={{ marginLeft: 8 }}>
            Submit
          </button>

          <button onClick={() => setPage("course")} style={{ marginLeft: 8 }}>
            Course Overview
          </button>

          <button onClick={() => setPage("create")} style={{ marginLeft: 8 }}>
            Create Course
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

      {page === "cover" && <CoverPage />}
      {page === "home" && <Home />}
      {page === "login" && <Login />}
      {page === "submit" && <Submit />}
      {page === "course" && (
        <CourseOverview 
          setPage={setPage} 
          role={role} 
          courseId={selectedCourseId}
        />
      )}
      {page === "course-team" && (
        <CourseTeam
          setPage={setPage}
          role={role}
          courseId={selectedCourseId}
        />
      )}

      {page === "course-discussion" && (
        <CourseDiscussion
          setPage={setPage}
          role={role}
          courseId={selectedCourseId}
        />
      )}
      {page === "create" && (
        <>
          <Home />
          <CreateCourse
            setPage={setPage}
            setSelectedCourseId={setSelectedCourseId}
          />
        </>
      )}
    </>
  );
}