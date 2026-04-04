import Header from "../components/Header";
import Navbar from "../components/Navbar";
import studyGroup from "../assets/study-group.jpg";
import "./CoverPage.css";
import { CheckCircle, ArrowRight } from "lucide-react";

function CoverPage({ setPage, currentUser, setCurrentUser, setRole }) {
  return (
    <div className="cover-page">
      <Header />
      <Navbar
        setPage={setPage}
        currentUser={null}
        setCurrentUser={setCurrentUser}
        setRole={setRole}
      />

      <section className="cover-hero">
        <div className="cover-hero-left">
          <p className="cover-eyebrow">Built for UBC students</p>

          <h1>Course Discussion &amp; Resource Hub</h1>

          <p className="cover-description">A collaborative platform where students can discover course materials, engage in discussions, and coordinate study activities through a shared academic space.</p>

          <div className="cover-features">
            <h3>What you can do</h3>
            <ul>
              <li>
                <CheckCircle size={20} />
                <span>Share and explore course resources</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Join course-related discussions</span>
              </li>
              <li>
                <CheckCircle size={20} />
                <span>Plan study sessions and meetups</span>
              </li>
            </ul>
          </div>

          <button
            className="cover-btn"
            onClick={() => setPage("home")}
          >
            <span>Get Started!</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="cover-hero-right">
            <img
                src={studyGroup}
                alt="Students collaborating and sharing course resources"
                className="cover-hero-image"
            />
        </div>
      </section>
    </div>
  );
}

export default CoverPage;