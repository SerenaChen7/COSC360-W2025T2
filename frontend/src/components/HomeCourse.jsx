import "./HomeCourse.css";

function HomeCourse({
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
}) {

return (
    <article className="course-card">
        <div className="course-image">
            <img src={imageUrl} alt={`${title} banner`} className="course-image__img" />   
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{isActiveToday ? "Active Today" : "Not Active Today"}</span>
                </div>
                <div className="course-status__row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>{memberCount} Members</span>
                </div>
                <div className="course-status__row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{location}</span>
                </div>
                <div className="course-status__row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    <span>{joinType}</span>
                </div>
            </div>
            <button className="course-btn" onClick={onViewDetails}>View Details</button>
        </div>
    </article>
);
/*
  const visibleTags = tags.slice(0, maxVisibleTags);
  const hiddenCount = Math.max(tags.length - maxVisibleTags, 0);

  const handleImageError = (e) => {
    e.currentTarget.src =
      "../assets/course-image.png";
  };

  return (
    <article className="group-card">
      <div className="group-card__banner">
        <img
          src={imageUrl}
          alt={`${title} banner`}
          onError={handleImageError}
          className="group-card__banner-image"
        />
      </div>

      <div className="group-card__content">
        <h2 className="group-card__title">{title}</h2>

        <div className="group-card__meta-top">
          <span className="pill pill--filled">{category}</span>
          <span className="pill pill--filled">{level}</span>
        </div>

        <div className="group-card__tags">
          {visibleTags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="pill pill--outline">
              {tag}
            </span>
          ))}

          {hiddenCount > 0 && (
            <span className="pill pill--outline pill--muted">+{hiddenCount} more</span>
          )}
        </div>

        <div className="group-card__details">
          <div className="detail-row">
            <span className="detail-icon">🕒</span>
            <span className="detail-text">
              {isActiveToday ? "Active Today" : "Not Active Today"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-icon">👥</span>
            <span className="detail-text">{memberCount} Members</span>
          </div>

          <div className="detail-row">
            <span className="detail-icon">📍</span>
            <span className="detail-text">{location}</span>
          </div>

          <div className="detail-row">
            <span className="detail-icon">🙌</span>
            <span className="detail-text">{joinType}</span>
          </div>
        </div>

        <button className="group-card__button" onClick={onViewDetails}>
          View Details
        </button>
      </div>
    </article>
  );*/
}

export default HomeCourse;