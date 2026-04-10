import { useMemo, useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CoverPage from "./pages/CoverPage";
import CourseOverview from "./pages/CourseOverview";
import CourseTeam from "./pages/CourseTeam";
import CourseDiscussion from "./pages/CourseDiscussion";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import AdminUsers from "./pages/AdminUsers";
import { useFavorites } from "./hooks/useFavorites";

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
  const { isFavorite, toggleFavorite } = useFavorites(currentUser?.id || currentUser?._id);
  const isLoggedIn = !!currentUser;
  if ((page === "dashboard" || page === "create") && !isLoggedIn) {
    return (
      <Login
        setPage={setPage}
        setRole={setRole}
        setCurrentUser={setCurrentUser}
      />
    );
  }
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
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
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
          setCurrentUser={setCurrentUser}
          setRole={setRole}
          isFavorite={isFavorite}
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
          isFavorite={isFavorite}
        />
      )}

      {page === "course-discussion" && (
        <CourseDiscussion
          setPage={setPage}
          role={role}
          courseId={selectedCourseId}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setRole={setRole}
          isFavorite={isFavorite}
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

      {page === "admin-users" && role === "admin" && (
        <AdminUsers
          setPage={setPage}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setRole={setRole}
        />
      )}
    </>
  );
}
