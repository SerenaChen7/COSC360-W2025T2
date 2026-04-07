import "./HomeCourse.css";
import defaultImg from "../assets/default-course.png";

function HomeCourse({
  id,
  title,
  category,
  level,
  tags = [],
  isActiveToday = false,
  memberCount = 0,
  location = "Online",
  joinType = "Open to Join",
  imageUrl,
  onViewDetails,
  maxVisibleTags = 5,
  isFavorite = false,
  onToggleFavorite,
}) {
  const fallbackImage = defaultImg;

  const handleImageError = (e) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <article className="course-card">
      <div className="course-image">
        <img
          src={imageUrl || fallbackImage}
          alt={`${title} banner`}
          className="course-image__img"
          onError={handleImageError}
        />
        <button
          className={`course-favorite-btn${isFavorite ? " course-favorite-btn--active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite && onToggleFavorite(id);
          }}
          aria-label={isFavorite ? "Remove from Spotlight" : "Add to Spotlight"}
          title={isFavorite ? "Remove from Spotlight Hubs" : "Add to Spotlight Hubs"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      <div className="course-details">
        <h2 className="course-title">{title}</h2>

        <div className="course-tags">
          <section className="card-chips" aria-label="Course tags">
            <div className="card-chips__filled" aria-label="Category and level">
              <span className="course-tag course-tag--filled">{category}</span>
              <span className="course-tag course-tag--filled">{level}</span>
            </div>

            <div className="card-chips__outline" aria-label="Additional tags">
              {tags.slice(0, maxVisibleTags).map((tag, index) => (
                <span key={`${tag}-${index}`} className="course-tag course-tag--outline">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="course-status">
          <div className="course-status__row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{isActiveToday ? "Active Today" : "Not Active Today"}</span>
          </div>

          <div className="course-status__row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{memberCount} Members</span>
          </div>

          <div className="course-status__row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{location}</span>
          </div>

          <div className="course-status__row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span>{joinType}</span>
          </div>
        </div>

        <button className="course-btn" onClick={onViewDetails}>
          View Details
        </button>
      </div>
    </article>
  );
}

export default HomeCourse;