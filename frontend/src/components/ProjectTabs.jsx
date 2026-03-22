import "./ProjectTabs.css";

function ProjectTabs({ activeTab = "overview", setPage }) {
  return (
    <div className="project-tabs">
      <button
        className={activeTab === "overview" ? "active" : ""}
        onClick={() => setPage("course")}
      >
        Overview
      </button>

      <button
        className={activeTab === "team" ? "active" : ""}
        onClick={() => setPage("course-team")}
      >
        Team
      </button>

      <button
        className={activeTab === "discussion" ? "active" : ""}
        onClick={() => setPage("course-discussion")}
      >
        Discussion
      </button>
    </div>
  );
}

export default ProjectTabs;