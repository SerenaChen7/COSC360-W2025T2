import React, { useState } from "react"; 
import HeroBanner from "../components/HeroBanner";
import ProjectTabs from "../components/ProjectTabs";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";

import HomeCourse from "../components/HomeCourse";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SpotlightSection from "../components/SpotlightSection";

export default function Home() {
  // State to store the course data array fetched from the backend
  const [courses, setCourses] = useState([]); 
  // State to track if a search was attempted to handle the "No results found"
  const [hasSearched, setHasSearched] = useState(false); 

  // Logic to handle search updates and fetch data from the Express server
  const handleSearchUpdate = async (value) => {
    // Basic validation: ignore empty search terms
    if (!value.trim()) return;

    try {
      // Requirement: Fetch GET request using query parameters (?q=)
      const response = await fetch(`http://localhost:3000/api/courses/search?q=${value}`);
      const data = await response.json(); 

      // Update state to trigger React re-render with new data
      setCourses(data); 
      setHasSearched(true); 
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      <HeroBanner />
      
      <div style={{ padding: "40px 60px" }}>
        {/* Search and Filtering Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <Filter label="Field" count="1" />
            <Filter label="Type" count="1" />
            <Filter label="Sort" count="✓" />
          </div>
          
          {/* Using onSearchSubmit as defined in your SearchBar component */}
          <SearchBar onSearchSubmit={handleSearchUpdate} />
        </div>

        {/* Dynamic Search Results Area (Requirement: Display results in the browser) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "40px" }}>
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <HomeCourse key={index} {...course} /> 
            ))
          ) : (
            // Show a message if no results are found
            hasSearched && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
                <p style={{ color: "red", fontSize: "18px" }}>No results found for your search.</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* aaaa */}
      <ProjectTabs />
      <SpotlightSection /> 
    </>
  );
}