import { useState, useEffect, useMemo, useRef } from "react";
import HeroBanner from "../components/HeroBanner";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import HomeCourse from "../components/HomeCourse";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SpotlightSection from "../components/SpotlightSection";
import ProfileEdit from "./ProfileEdit";
import { useFavorites } from "../hooks/useFavorites";

const LEVEL_OPTIONS = [
  { value: "100 Level", label: "100 Level" },
  { value: "200 Level", label: "200 Level" },
  { value: "300 Level", label: "300 Level" },
  { value: "400 Level", label: "400 Level" },
  { value: "Career Development", label: "Career Development" },
];

const SORT_OPTIONS = [
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "most", label: "Most Members" },
  { value: "least", label: "Least Members" },
];

export default function Home({ setPage, setSelectedCourseId, currentUser, setCurrentUser, setRole }) {
  const spotlightRef = useRef(null);
  const [allCourses, setAllCourses] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState([]);
  const [levelFilter, setLevelFilter] = useState([]);
  const [sortFilter, setSortFilter] = useState([]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => setAllCourses(data))
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, [API_URL]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSearchResults(null);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/courses/search?q=${searchTerm}`
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, API_URL]);

  const courseTypeOptions = useMemo(() => {
    const types = [...new Set(allCourses.map((c) => c.title.split(" ")[0]))].sort();
    return types.map((t) => ({ value: t, label: t }));
  }, [allCourses]);

  const displayedCourses = useMemo(() => {
    let courses = searchResults !== null ? searchResults : allCourses;

    if (courseFilter.length > 0) {
      courses = courses.filter((c) => courseFilter.some((f) => c.title.startsWith(f)));
    }

    if (levelFilter.length > 0) {
      courses = courses.filter((c) => levelFilter.includes(c.type));
    }

    if (sortFilter.length > 0) {
      const sort = sortFilter[0];
      if (sort === "az") {
        courses = [...courses].sort((a, b) => a.title.localeCompare(b.title));
      } else if (sort === "za") {
        courses = [...courses].sort((a, b) => b.title.localeCompare(a.title));
      } else if (sort === "most") {
        courses = [...courses].sort((a, b) => b.memberCount - a.memberCount);
      } else if (sort === "least") {
        courses = [...courses].sort((a, b) => a.memberCount - b.memberCount);
      }
    }

    return courses;
  }, [allCourses, searchResults, courseFilter, levelFilter, sortFilter]);

    //Asychronously fetches the list of courses from the backend API 
  const spotlightCourses = useMemo(() => {
    return allCourses.filter((course) => favorites.has(course._id));
  }, [allCourses, favorites]);

  const handleToggleFavorite = (courseId) => {
    const wasFavorite = isFavorite(courseId);

    toggleFavorite(courseId);

        // only scroll into view when adding to favorites, not when removing
    if (!wasFavorite) {
      setTimeout(() => {
        spotlightRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 50);
    }
  };

  return (
    <>
      <Header />
      <Navbar
        setPage={setPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setRole={setRole}
        onProfileClick={() => setShowProfileEdit(true)}
      />
      <HeroBanner />
      <div style={{ padding: "20px 60px 0 60px" }}>
        <h2
          style={{
            fontFamily: '"Public Sans", sans-serif',
            fontSize: "26px",
            fontWeight: 700,
            color: "#001D40",
            margin: 0
          }}
        >
          Hi {currentUser?.username || "Guest"},
        </h2>
      </div>

      <div ref={spotlightRef}>
        <SpotlightSection
          spotlightCourses={spotlightCourses}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={(courseId) => {
            setSelectedCourseId(courseId);
            setPage("course");
          }}
        />
      </div>

      <div style={{ padding: "40px 60px" }}>
        <h2 style={{ fontFamily: '"Public Sans", sans-serif', fontSize: "22px", fontWeight: 600, color: "#001D40", marginBottom: "24px" }}>
          BROWSE HUBS
        </h2>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "15px" }}>
            <Filter
              label="Course"
              options={courseTypeOptions}
              selectedValues={courseFilter}
              onChange={setCourseFilter}
            />
            <Filter
              label="Level"
              options={LEVEL_OPTIONS}
              selectedValues={levelFilter}
              onChange={setLevelFilter}
            />
            <Filter
              label="Sort"
              options={SORT_OPTIONS}
              selectedValues={sortFilter}
              onChange={setSortFilter}
              singleSelect
            />
          </div>
          <SearchBar onSearchSubmit={setSearchTerm} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {displayedCourses.length > 0 ? (
            displayedCourses.map((course) => (
              <HomeCourse
                key={course._id}
                {...course}
                id={course._id}
                isFavorite={isFavorite(course._id)}
                onToggleFavorite={handleToggleFavorite}
                onViewDetails={() => {
                  setSelectedCourseId(course._id);
                  setPage("course");
                }}
              />
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
              <p style={{ color: "red", fontSize: "18px" }}>No results found.</p>
            </div>
          )}
        </div>
      </div>

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
