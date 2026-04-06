import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import CourseBanner from "../components/CourseBanner";
import ProjectTabs from "../components/ProjectTabs";
import "./CourseDiscussion.css";
import AdminActions from "../components/AdminActions";
import removeIcon from "../assets/remove.png";

function CourseDiscussion({ setPage, role, courseId, currentUser, setCurrentUser, setRole }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [course, setCourse] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newText, setNewText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  //Reply state
  const [replyingToPostId, setReplyingToPostId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isReplySending, setIsReplySending] = useState(false);

  const effectiveCourseId = courseId || course?._id;
  const token = localStorage.getItem("token");

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    return date.toLocaleDateString();
  };

  const getInitial = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  //All protected requests, such as creating posts, replying, and deleting content, send the JWT token in the Authorization header.
  const handleDeletePost = async (postId) => {
    if (!effectiveCourseId) return;

    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/courses/${effectiveCourseId}/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            // We include the Authorization header with the token to authenticate the request
            Authorization: `Bearer ${token}`
          }
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

  //The same applies to deleting replies, where the token is sent in the Authorization header to ensure that only authorized users can delete their own replies or, in the case of admins, any reply.
  const handleDeleteReply = async (postId, replyId) => {
    if (!effectiveCourseId) return;

    const confirmed = window.confirm("Are you sure you want to delete this reply?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/courses/${effectiveCourseId}/posts/${postId}/replies/${replyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? data : post))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const incomingFiles = Array.from(e.target.files || []);
    if (incomingFiles.length === 0) return;

    setSelectedFiles((prev) => {
      const merged = [...prev];

      for (const file of incomingFiles) {
        const alreadyExists = merged.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );

        if (!alreadyExists) {
          merged.push(file);
        }

        if (merged.length >= 5) break;
      }

      if (merged.length > 5) {
        return merged.slice(0, 5);
      }

      return merged;
    });

    e.target.value = "";
  };

  const handleRemoveSelectedFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSendPost = async () => {
      if (!newText.trim() && selectedFiles.length === 0) return;
      if (!effectiveCourseId) return;
      if (isSending) return;

      try {
        setIsSending(true);

        const formData = new FormData();
        formData.append("text", newText);

        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        const res = await fetch(
          `http://localhost:3000/api/courses/${effectiveCourseId}/posts`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          return;
        }

        setPosts((prev) => [data, ...prev]);
        setNewText("");
        setSelectedFiles([]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSending(false);
      }
    };

    const handleSendReply = async (postId) => {
    if (!replyText.trim()) return;
    if (!effectiveCourseId) return;
    if (isReplySending) return;

    try {
      setIsReplySending(true);

      const res = await fetch(
        `http://localhost:3000/api/courses/${effectiveCourseId}/posts/${postId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ text: replyText })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? data : post))
      );

      setReplyText("");
      setReplyingToPostId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsReplySending(false);
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
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, [effectiveCourseId]);

  return (
    <div className="course-discussion-page">
      <Header />
      <Navbar
        setPage={setPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setRole={setRole}
      />

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
                placeholder={
                  currentUser
                    ? "Add your comment... (Enter to send, Shift+Enter for new line)"
                    : "Log in to join the discussion"
                }
                className="discussion-input"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={1}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    await handleSendPost();
                  }
                }}
                disabled={isSending || !currentUser}
              />

              <label className="file-upload-button" title="Attach files">
                📎
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  hidden
                  disabled={isSending || !currentUser}
                />
              </label>

              <button
                className="discussion-send-button"
                onClick={handleSendPost}
                disabled={isSending || !currentUser}
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="pending-files-wrapper">
                <p className="pending-files-title">
                  Attachments ready to send ({selectedFiles.length}/5)
                </p>

                <div className="pending-files-list">
                  {selectedFiles.map((file, index) => (
                    <div className="pending-file-chip" key={`${file.name}-${file.lastModified}-${index}`}>
                      <span className="pending-file-name">📎 {file.name}</span>
                      <button
                        type="button"
                        className="remove-file-button"
                        onClick={() => handleRemoveSelectedFile(index)}
                        disabled={isSending}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="discussion-list">
              {posts.map((post) => {
                const canDeletePost =
                  currentUser &&
                  (currentUser.role === "admin" ||
                    post.author?._id === currentUser.id);

                return (
                  <div className="discussion-post" key={post._id}>
                  <div className="discussion-post-header">
                    <div className="discussion-avatar">
                      {getInitial(post.author?.username || post.authorName)}
                    </div>

                    <div className="discussion-post-info">
                      <p className="discussion-author">
                        {post.author?.username || post.authorName || "User"}{" "}
                        <span style={{ color: "#7b879b" }}>
                          · {formatTime(post.createdAt)}
                        </span>
                      </p>
                    </div>

                    {canDeletePost && (
                      <button
                        className="remove-icon-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post._id);
                        }}
                      >
                        <img src={removeIcon} alt="Remove" />
                      </button>
                    )}
                  </div>


                  {post.text && (
                    <p className="discussion-content">{post.text}</p>
                  )}

                  {post.attachments?.length > 0 && (
                    <div className="discussion-attachments">
                      {post.attachments.map((attachment, index) => (
                        <a
                          key={attachment._id || index}
                          href={`http://localhost:3000/api/courses/posts/${post._id}/attachments/${attachment._id}/download`}
                          className="discussion-file-link"
                        >
                          📎 {attachment.fileName}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="discussion-post-actions">
                    <button
                      type="button"
                      className="reply-toggle-button"
                      onClick={() => {
                        if (replyingToPostId === post._id) {
                          setReplyingToPostId(null);
                          setReplyText("");
                        } else {
                          setReplyingToPostId(post._id);
                          setReplyText("");
                        }
                      }}
                    >
                      Reply
                    </button>
                  </div>

                  {replyingToPostId === post._id && (
                    <div className="reply-input-wrapper">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        className="discussion-reply-input"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            await handleSendReply(post._id);
                          }
                        }}
                        disabled={isReplySending || !currentUser}
                      />

                      <button
                        type="button"
                        className="discussion-reply-send-button"
                        onClick={() => handleSendReply(post._id)}
                        disabled={isReplySending || !currentUser}
                      >
                        {isReplySending ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  )}

                  {post.replies?.length > 0 && (
                    <div className="discussion-replies">
                      {post.replies.map((reply, index) => {
                        const canDeleteReply =
                          currentUser &&
                          (currentUser.role === "admin" ||
                            reply.author?._id === currentUser.id);

                        return (
                          <div className="discussion-reply" key={reply._id || index}>
                          <div className="discussion-reply-arrow">↪</div>

                          <div className="discussion-reply-body">
                            <div className="discussion-post-header">
                              <div className="discussion-avatar small">
                                {getInitial(reply.author?.username || reply.authorName)}
                              </div>

                              <div className="discussion-post-info">
                                <p className="discussion-author">
                                  {reply.author?.username || reply.authorName || "User"}{" "}
                                  <span style={{ color: "#7b879b" }}>
                                    · {formatTime(reply.createdAt)}
                                  </span>
                                </p>
                              </div>

                              {canDeleteReply && (
                                <button
                                  className="remove-icon-button"
                                  title="Delete reply"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteReply(post._id, reply._id);
                                  }}
                                >
                                  <img src={removeIcon} alt="Remove" />
                                </button>
                              )}
                            </div>

                            <p className="discussion-content">{reply.text}</p>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                );
              })}
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