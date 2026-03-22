import { useEffect, useState } from "react";
import "./SpotlightSection.css";
import HomeCourse from "./HomeCourse";

export default function SpotlightSection({ favorites, onToggleFavorite }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, []);

  const favoritedCourses = courses.filter((c) => favorites && favorites.has(c.id));

  return (
    <div className="spotlight-section">
      <div className="spotlight-section__inner">
        <h2 className="spotlight-section__title">SPOTLIGHT HUBS</h2>
        {favoritedCourses.length === 0 ? (
          <p className="spotlight-section__empty">
            Star a hub below to pin it here as a spotlight.
          </p>
        ) : (
          <div className="spotlight-section__grid">
            {favoritedCourses.map((course) => (
              <HomeCourse
                key={course.id}
                {...course}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
