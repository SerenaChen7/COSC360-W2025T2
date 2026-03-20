import "./SpotlightSection.css";
import HomeCourse from "./HomeCourse";

export default function SpotlightSection({ courses }) {
  return (
    <div className="spotlight-section">
      <div className="spotlight-section__inner">
        <h2 className="spotlight-section__title">SPOTLIGHT HUBS</h2>
        {courses.length === 0 ? (
          <p className="spotlight-section__no-results">No results found.</p>
        ) : (
          <div className="spotlight-section__grid">
            {courses.map((course) => (
              <HomeCourse key={course.id} {...course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}