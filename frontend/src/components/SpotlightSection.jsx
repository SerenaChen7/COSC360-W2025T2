import "./SpotlightSection.css";
import HomeCourse from "./HomeCourse";
import mockCourses from "./mockCourses";

export default function SpotlightSection() {
  return (
    <div className="spotlight-section">
      <div className="spotlight-section__inner">
        <h2 className="spotlight-section__title">SPOTLIGHT HUBS</h2>
        <div className="spotlight-section__grid">
          {mockCourses.map((course) => (
            <HomeCourse key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}