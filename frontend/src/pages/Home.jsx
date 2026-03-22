import React, { useState, useEffect } from "react";
import HeroBanner from "../components/HeroBanner";
import ProjectTabs from "../components/ProjectTabs";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import HomeCourse from "../components/HomeCourse";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SpotlightSection from "../components/SpotlightSection";
import { useFavorites } from "../hooks/useFavorites";

export default function Home() {
  const [allCourses, setAllCourses] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Load all courses for Browse Hubs on mount
  useEffect(() => {
    fetch("http://localhost:3000/api/courses")
      .then((res) => res.json())
      .then((data) => setAllCourses(data))
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, []);

  const handleSearchUpdate = async (value) => {
    if (!value.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/courses/search?q=${value}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const displayedCourses = searchResults !== null ? searchResults : allCourses;

  return (
    <>
      <Header />
      <Navbar />
      <HeroBanner />

      <SpotlightSection favorites={favorites} onToggleFavorite={toggleFavorite} />

      <div style={{ padding: "40px 60px" }}>
        <h2 style={{ fontFamily: '"Public Sans", sans-serif', fontSize: "22px", fontWeight: 600, color: "#001D40", marginBottom: "24px" }}>
          BROWSE HUBS
        </h2>

        {/* Search and Filtering Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "15px" }}>
            <Filter label="Field" count="1" />
            <Filter label="Type" count="1" />
            <Filter label="Sort" count="✓" />
          </div>
          <SearchBar onSearchSubmit={handleSearchUpdate} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {displayedCourses.length > 0 ? (
            displayedCourses.map((course) => (
              <HomeCourse
                key={course.id}
                {...course}
                isFavorite={isFavorite(course.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : searchResults !== null ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
              <p style={{ color: "red", fontSize: "18px" }}>No results found for your search.</p>
            </div>
          ) : null}
        </div>
      </div>

      <ProjectTabs />
    </>
  );
}
