import HeroBanner from "../components/HeroBanner";
import ProjectTabs from "../components/ProjectTabs";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";

import HomeCourse from "../components/HomeCourse";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SpotlightSection from "../components/SpotlightSection";
export default function Home() {
  const handleSearchUpdate = (value) => {
    console.log("Search input received in Home:", value);
  };

  return (
    <>
      <Header />
      <Navbar />
      <HeroBanner />
      
      <div style={{ padding: "40px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <Filter label="Field" count="1" />
            <Filter label="Type" count="1" />
            <Filter label="Sort" count="✓" />
          </div>
          
          <SearchBar onSearchChange={handleSearchUpdate} />
        </div>
      </div>

      <ProjectTabs />
      <SpotlightSection /> 
    </>
  );
}