import Header from "../components/Header";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CourseBanner from "../components/CourseBanner";
import ProjectTabs from "../components/ProjectTabs";
import "./CourseDiscussion.css";
import AdminActions from "../components/AdminActions";
import removeIcon from "../assets/remove.png";

function CourseDiscussion({ setPage, role, courseId }) {
  const [fileName, setFileName] = useState("");
  const [course, setCourse] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newText, setNewText] = useState("");
  const effectiveCourseId = courseId || course?._id;
  
  // Format time like "just now", "5 min ago", "2 hr ago", or date string for older posts
  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const diff = (now - date) / 1000; // seconds

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    return date.toLocaleDateString();
  };

  // Admin function to delete a post
  const handleDeletePost = async (postId) => {
    if (!effectiveCourseId) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/courses/${effectiveCourseId}/posts/${postId}`,
        {
          method: "DELETE"
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetch(`http://localhost:3000/api/courses/${courseId}`)
        .then((res) => res.json())
        .then((data) => setCourse(data))
        .catch((err) => console.error(err));
      return;
    }

    fetch("http://localhost:3000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourse(data[0]))
      .catch((err) => console.error(err));
  }, [courseId]);

  useEffect(() => {
    if (!effectiveCourseId) return;

    fetch(`http://localhost:3000/api/courses/${effectiveCourseId}/posts`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }, [effectiveCourseId]);

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
        <CourseBanner course={course} />
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
              <textarea
                placeholder="Add your comment... (Enter to send, Shift+Enter for new line)"
                className="discussion-input"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={1}
                // Expand textarea as user types
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    if (!newText.trim()) return;
                    if (!effectiveCourseId) return;

                    const res = await fetch(
                      `http://localhost:3000/api/courses/${effectiveCourseId}/posts`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ text: newText })
                      }
                    );

                    const data = await res.json();

                    if (res.ok) {
                      setPosts((prev) => [data, ...prev]);
                      setNewText("");
                    }
                  }
                }}
              />

              <label className="file-upload-button">
                📎
                <input
                  type="file"
                  onChange={(e) => setFileName(e.target.files[0]?.name)}
                  hidden
                />
              </label>
              <button
                className="discussion-send-button"
                onClick={async () => {
                  if (!newText.trim()) return;
                  if (!effectiveCourseId) return;

                  const res = await fetch(
                    `http://localhost:3000/api/courses/${effectiveCourseId}/posts`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({ text: newText })
                    }
                  );

                  const data = await res.json();

                  if (res.ok) {
                    setPosts((prev) => [data, ...prev]);
                    setNewText("");
                  } else {
                    console.error(data);
                  }
                }}
              >
                Send
              </button>
            </div>

            {fileName && (
              <div className="file-name-row">
                <p className="file-name">{fileName}</p>
                <button
                  type="button"
                  className="remove-file-button"
                  onClick={() => setFileName("")}
                >
                  ×
                </button>
              </div>
            )}

            <div className="discussion-list">
              {posts.map((post) => (
                <div className="discussion-post" key={post._id}>
                  <div className="discussion-post-header">
                    <div className="discussion-avatar">
                      U
                    </div>
                    <div className="discussion-post-info">
                      <p className="discussion-author">
                        User <span style={{ color: "#7b879b" }}>· {formatTime(post.createdAt)}</span>
                      </p>
                    </div>

                    {role === "admin" && (
                      <button
                        className="remove-icon-button"
                        title="Remove comment"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post._id);
                        }}
                      >
                        <img src={removeIcon} alt="Remove" />
                      </button>
                    )}
                  </div>

                  <p className="discussion-content">{post.text}</p>

                  {post.replies?.length > 0 && (
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
                                <p className="discussion-author">{reply.author}</p>
                                <p className="discussion-meta">{reply.meta}</p>
                              </div>
                              {role === "admin" && (
                                <button className="remove-icon-button" title="Remove comment">
                                  <img src={removeIcon} alt="Remove" />
                                </button>
                              )}
                            </div>

                            <p className="discussion-content">{reply.content}</p>

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
            {role === "guest" && (
              <button className="join-button">➤ Log in to Join</button>
            )}
            {role === "user" && (
              <button className="join-button">➤ Join Course</button>
            )}
          </div>
          {role === "admin" && <AdminActions />}
        </aside>
      </main>
    </div>
  );
}

export default CourseDiscussion;