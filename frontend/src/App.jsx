import { useMemo, useState, useEffect } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CoverPage from "./pages/CoverPage";
import CourseOverview from "./pages/CourseOverview";
import CourseTeam from "./pages/CourseTeam";
import CourseDiscussion from "./pages/CourseDiscussion";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";

export default function App() {
  const savedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const [page, setPage] = useState("cover");
  // here allows the login status to stay consistent across pages.
  const [role, setRole] = useState(savedUser?.role || "guest");
  const [currentUser, setCurrentUser] = useState(savedUser || null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userData = params.get("user");

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setCurrentUser(user);
        setRole(user.role || "user");

        setPage("home");

        window.history.replaceState({}, document.title, "/");
      } catch (err) {
        console.error("Social login parsing error:", err);
      }
    }
  }, []); 

  return (
    <>
      {page === "cover" && <CoverPage setPage={setPage} />}

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

      {page === "signup" && <Signup setPage={setPage} />}

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
          currentUser={currentUser}
        />
      )}
    </>
  );
}