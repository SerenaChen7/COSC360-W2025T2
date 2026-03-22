import Header from "../components/Header";
import Navbar from "../components/Navbar";
import CourseBanner from "../components/CourseBanner";
import ProjectTabs from "../components/ProjectTabs";
import "./CourseDiscussion.css";

function CourseDiscussion({ setPage }) {
  const discussions = [
    {
      id: 1,
      author: "Sarah Chen",
      meta: "Media Studies • 4th Year",
      content:
        "This sounds like an amazing project! I'm particularly interested in script writing. Which genre are you thinking about?",
      replies: [
        {
          id: 11,
          author: "Sarah Chen",
          meta: "Media Studies • 4th Year",
          content:
            "Thank you for the good question! We're leaning towards drama but we as a team will decide together."
        }
      ]
    },
    {
      id: 2,
      author: "Sarah Chen",
      meta: "Media Studies • 4th Year",
      content:
        "This sounds like an amazing project! I'm particularly interested in script writing. Which genre are you thinking about?",
      replies: []
    }
  ];

  return (
    <div className="course-discussion-page">
      <Header />
      <Navbar />

      <div className="course-discussion-hero">
        <CourseBanner />
      </div>

      <div className="course-discussion-tabs">
        <ProjectTabs activeTab="discussion" setPage={setPage} />
      </div>

      <main className="course-discussion-content">
        <section className="course-discussion-main">
          <div className="discussion-card">
            <h3>Public Discussions</h3>
            <p className="discussion-subtitle">
              Ask questions and discuss the project with the team
            </p>

            <div className="discussion-input-row">
              <input
                type="text"
                placeholder="Add your comment..."
                className="discussion-input"
              />
              <button className="discussion-send-button">Send</button>
            </div>

            <div className="discussion-list">
              {discussions.map((post) => (
                <div className="discussion-post" key={post.id}>
                  <div className="discussion-post-header">
                    <div className="discussion-avatar">
                      {post.author.charAt(0)}
                    </div>
                    <div className="discussion-post-info">
                      <p className="discussion-author">{post.author}</p>
                      <p className="discussion-meta">{post.meta}</p>
                    </div>
                  </div>

                  <p className="discussion-content">{post.content}</p>

                  {post.replies.length > 0 && (
                    <div className="discussion-replies">
                      {post.replies.map((reply) => (
                        <div className="discussion-reply" key={reply.id}>
                          <div className="discussion-reply-arrow">↪</div>

                          <div className="discussion-reply-body">
                            <div className="discussion-post-header">
                              <div className="discussion-avatar small">
                                {reply.author.charAt(0)}
                              </div>
                              <div className="discussion-post-info">
                                <p className="discussion-author">
                                  {reply.author}
                                </p>
                                <p className="discussion-meta">{reply.meta}</p>
                              </div>
                            </div>

                            <p className="discussion-content">
                              {reply.content}
                            </p>

                            <input
                              type="text"
                              placeholder="Add your comment..."
                              className="discussion-reply-input"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="course-discussion-sidebar">
          <div className="join-card">
            <h3>Join This Hub</h3>
            <p className="join-subtitle">Ready to join?</p>
            <p>
              Become part of the community to participate in discussions,
              access shared resources, and stay updated on upcoming sessions.
            </p>
            <button className="join-button">➤ Log in to Join</button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default CourseDiscussion;