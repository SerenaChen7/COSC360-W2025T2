import heroImage from "../assets/hero.jpg";
import "./HeroBanner.css";

function HeroBanner() {
  return (
    <section
      className="hero-banner"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay">
        <h1>Learn Together. Achieve More.</h1>
        <p>
          A space for students to explore course hubs, join study groups,
          and share academic resources.
        </p>
      </div>
    </section>
  );
}

export default HeroBanner;