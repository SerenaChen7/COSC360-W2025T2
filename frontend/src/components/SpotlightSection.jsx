import "./SpotlightSection.css";
import HomeCourse from "./HomeCourse";

export default function SpotlightSection({ spotlightCourses = [], onToggleFavorite, onViewDetails }) {
  return (
    <div className="spotlight-section">
      <div className="spotlight-section__inner">
        <h2 className="spotlight-section__title">SPOTLIGHT HUBS</h2>
        {spotlightCourses.length === 0 ? (
          <p className="spotlight-section__empty">
            Star a hub below to pin it here as a spotlight.
          </p>
        ) : (
          <div className="spotlight-section__grid">
            {spotlightCourses.map((course) => (
              <HomeCourse
                key={course._id}
                {...course}
                id={course._id}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onViewDetails={() => onViewDetails(course._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}