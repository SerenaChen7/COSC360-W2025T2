import { useState, useEffect } from 'react';
import HeroBanner from "../components/HeroBanner";
import ProjectTabs from "../components/ProjectTabs";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SpotlightSection from "../components/SpotlightSection";

const TITLE_OPTIONS = ['COSC', 'MATH', 'PHYS', 'ECON', 'STAT', 'ENGL', 'BIOL'];
const LEVEL_OPTIONS = ['100 Level', '200 Level', '300 Level', '400 Level'];
const SORT_OPTIONS = ['A-Z', 'Z-A', 'Most Members', 'Least Members'];

const SORT_MAP = {
  'A-Z': 'az',
  'Z-A': 'za',
  'Most Members': 'most',
  'Least Members': 'least',
};

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('');

  const fetchCourses = (title, level, sort) => {
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (level) params.set('level', level);
    if (sort) params.set('sort', SORT_MAP[sort]);

    fetch(`http://localhost:3000/api/courses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setCourses(data));
  };

  useEffect(() => {
    fetchCourses(titleFilter, levelFilter, sortFilter);
  }, [titleFilter, levelFilter, sortFilter]);

  const handleSearch = (query) => {
    fetch(`http://localhost:3000/api/courses/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setCourses(data));
  };

  return (
    <>
      <Header />
      <Navbar />
      <HeroBanner />

      <div style={{ padding: "40px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>

          <div style={{ display: "flex", gap: "15px" }}>
            <Filter
              label="Title"
              options={TITLE_OPTIONS}
              value={titleFilter}
              onChange={setTitleFilter}
            />
            <Filter
              label="Level"
              options={LEVEL_OPTIONS}
              value={levelFilter}
              onChange={setLevelFilter}
            />
            <Filter
              label="Sort"
              options={SORT_OPTIONS}
              value={sortFilter}
              onChange={setSortFilter}
            />
          </div>

          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <ProjectTabs />
      <SpotlightSection courses={courses} />
    </>
  );
}
