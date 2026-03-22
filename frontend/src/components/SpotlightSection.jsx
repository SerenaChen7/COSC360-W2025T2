import { useEffect, useState } from "react";
import "./SpotlightSection.css";
import HomeCourse from "./HomeCourse";

export default function SpotlightSection() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, []);

  return (
    <div className="spotlight-section">
      <div className="spotlight-section__inner">
        <h2 className="spotlight-section__title">SPOTLIGHT HUBS</h2>
        <div className="spotlight-section__grid">
          {courses.map((course) => (
            <HomeCourse key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}