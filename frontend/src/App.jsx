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
import AdminUsers from "./pages/AdminUsers";
import ProfileEdit from "./pages/ProfileEdit";
import { useFavorites } from "./hooks/useFavorites";

export default function App() {
  const savedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("page");
    return savedUser ? savedPage || "home" : "cover";
  });

  const [role, setRole] = useState(savedUser?.role || "guest");
  const [currentUser, setCurrentUser] = useState(savedUser || null);
  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    return localStorage.getItem("selectedCourseId") || null;
  });
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites(
    currentUser?.id || currentUser?._id
  );

  const isLoggedIn = !!currentUser;

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("page", page);
    } else {
      localStorage.removeItem("page");
    }
  }, [page, isLoggedIn]);

  useEffect(() => {
    if (selectedCourseId) {
      localStorage.setItem("selectedCourseId", selectedCourseId);
    } else {
      localStorage.removeItem("selectedCourseId");
    }
  }, [selectedCourseId]);

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
          onProfileClick={() => setShowProfileEdit(true)}
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
          onProfileClick={() => setShowProfileEdit(true)}
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
          onProfileClick={() => setShowProfileEdit(true)}
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
          onProfileClick={() => setShowProfileEdit(true)}
        />
      )}

      {page === "create" && (
        <>
          <Dashboard
            setPage={setPage}
            setSelectedCourseId={setSelectedCourseId}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setRole={setRole}
            onProfileClick={() => setShowProfileEdit(true)}
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
          setCurrentUser={setCurrentUser}
          setRole={setRole}
          onProfileClick={() => setShowProfileEdit(true)}
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

      {showProfileEdit && (
        <ProfileEdit
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          onClose={() => setShowProfileEdit(false)}
        />
      )}
    </>
  );
}
