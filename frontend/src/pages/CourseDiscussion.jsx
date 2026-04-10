import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import CourseBanner from "../components/CourseBanner";
import ProjectTabs from "../components/ProjectTabs";
import "./CourseDiscussion.css";
import AdminActions from "../components/AdminActions";
import removeIcon from "../assets/remove.png";

function CourseDiscussion({ setPage, role, courseId, currentUser, setCurrentUser, setRole, isFavorite }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [course, setCourse] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newText, setNewText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  // Reply state
  const [replyingToPostId, setReplyingToPostId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isReplySending, setIsReplySending] = useState(false);

  const effectiveCourseId = courseId || course?._id;
  const token = localStorage.getItem("token");
  const [isJoined, setIsJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const currentUserId = currentUser?.id || currentUser?._id || null;

  const getAuthorId = (author) => {
    if (!author) return null;
    if (typeof author === "string") return author;
    return author._id || author.id || null;
  };

  const fetchJoinedStatus = async () => {
    if (!courseId) return;

    if (role !== "user" && role !== "admin") {
      setIsJoined(false);
      return;
    }

    if (!token) {
      setIsJoined(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/courses/joined`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch joined courses");
      }

      const data = await res.json();
      const joinedIds = (data || []).map((course) => String(course._id));
      setIsJoined(joinedIds.includes(String(courseId)));
    } catch (err) {
      console.error(err);
      setIsJoined(false);
    }
  };

  const handleJoin = async () => {
    if (!courseId) return;
    setJoining(true);
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join");

      setIsJoined(true);
      setCourse((prev) => (prev ? { ...prev, memberCount: data.memberCount } : prev));
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!courseId) return;
    setJoining(true);
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/leave`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to leave");

      setIsJoined(false);
      setCourse((prev) => (prev ? { ...prev, memberCount: data.memberCount } : prev));
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

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

  // All protected requests, such as creating posts, replying, and deleting content, send the JWT token in the Authorization header.
  const handleDeletePost = async (postId) => {
    if (!effectiveCourseId) return;

    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${API_URL}/api/courses/${effectiveCourseId}/posts/${postId}`,
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

  // The same applies to deleting replies, where the token is sent in the Authorization header to ensure that only authorized users can delete their own replies or, in the case of admins, any reply.
  const handleDeleteReply = async (postId, replyId) => {
    if (!effectiveCourseId) return;

    const confirmed = window.confirm("Are you sure you want to delete this reply?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${API_URL}/api/courses/${effectiveCourseId}/posts/${postId}/replies/${replyId}`,
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
        `${API_URL}/api/courses/${effectiveCourseId}/posts`,
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
        `${API_URL}/api/courses/${effectiveCourseId}/posts/${postId}/replies`,
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
      fetch(`${API_URL}/api/courses/${courseId}`)
        .then((res) => res.json())
        .then((data) => setCourse(data))
        .catch((err) => console.error(err));

      fetchJoinedStatus();
      return;
    }

    fetch(`${API_URL}/api/courses`)
      .then((res) => res.json())
      .then((data) => setCourse(data[0]))
      .catch((err) => console.error(err));
  }, [courseId, role]);

  useEffect(() => {
    if (!effectiveCourseId) return;

    fetch(`${API_URL}/api/courses/${effectiveCourseId}/posts`)
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
        <CourseBanner course={course} isFavorite={isFavorite(courseId)} />
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
                  !currentUser
                    ? "Log in to join the discussion"
                    : !isJoined
                    ? "Join this hub to participate in discussions"
                    : "Add your comment... (Enter to send, Shift+Enter for new line)"
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
                disabled={isSending || !currentUser || !isJoined}
              />

              <label className="file-upload-button" title="Attach files">
                📎
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  hidden
                  disabled={isSending || !currentUser || !isJoined}
                />
              </label>

              <button
                className="discussion-send-button"
                onClick={handleSendPost}
                disabled={isSending || !currentUser || !isJoined}
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
                    <div
                      className="pending-file-chip"
                      key={`${file.name}-${file.lastModified}-${index}`}
                    >
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
                const postAuthorId = getAuthorId(post.author);
                const canDeletePost =
                  currentUser &&
                  (currentUser.role === "admin" ||
                    String(postAuthorId) === String(currentUserId));

                return (
                  <div className="discussion-post" key={post._id}>
                    <div className="discussion-post-header">
                      <div className="discussion-avatar">
                        {post.author?.profileImage ? (
                          <img
                            src={`${API_URL}${post.author.profileImage}`}
                            alt="avatar"
                            className="discussion-avatar-img"
                          />
                        ) : (
                          getInitial(post.author?.username || post.authorName)
                        )}
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
                            href={`${API_URL}/api/courses/posts/${post._id}/attachments/${attachment._id}/download`}
                            className="discussion-file-link"
                          >
                            📎 {attachment.fileName}
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="discussion-post-actions">
                      {currentUser && isJoined && (
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
                      )}
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
                          disabled={isReplySending || !currentUser || !isJoined}
                        />

                        <button
                          type="button"
                          className="discussion-reply-send-button"
                          onClick={() => handleSendReply(post._id)}
                          disabled={isReplySending || !currentUser || !isJoined}
                        >
                          {isReplySending ? "Sending..." : "Send Reply"}
                        </button>
                      </div>
                    )}

                    {post.replies?.length > 0 && (
                      <div className="discussion-replies">
                        {post.replies.map((reply, index) => {
                          const replyAuthorId = getAuthorId(reply.author);
                          const canDeleteReply =
                            currentUser &&
                            (currentUser.role === "admin" ||
                              String(replyAuthorId) === String(currentUserId));

                          return (
                            <div className="discussion-reply" key={reply._id || index}>
                              <div className="discussion-reply-arrow">↪</div>

                              <div className="discussion-reply-body">
                                <div className="discussion-post-header">
                                  <div className="discussion-avatar small">
                                    {reply.author?.profileImage ? (
                                      <img
                                        src={`${API_URL}${reply.author.profileImage}`}
                                        alt="avatar"
                                        className="discussion-avatar-img"
                                      />
                                    ) : (
                                      getInitial(reply.author?.username || reply.authorName)
                                    )}
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
            <p className="join-subtitle">
              {isJoined ? "You are already a member" : "Ready to join?"}
            </p>
            <p>
              Become part of the community to participate in discussions,
              access shared resources, and stay updated on upcoming sessions.
            </p>

            {role === "guest" && (
              <button className="join-button" onClick={() => setPage("login")}>
                ➤ Log in to Join
              </button>
            )}

            {(role === "user" || role === "admin") &&
              (isJoined ? (
                <button
                  className="join-button leave-button"
                  onClick={handleLeave}
                  disabled={joining}
                >
                  {joining ? "Leaving..." : "✕ Leave Course"}
                </button>
              ) : (
                <button
                  className="join-button"
                  onClick={handleJoin}
                  disabled={joining}
                >
                  ➤ {joining ? "Joining..." : "Join Course"}
                </button>
              ))}
          </div>

          {role === "admin" && (
            <AdminActions
              courseId={effectiveCourseId}
              course={course}
              onCourseUpdated={(updated) =>
                setCourse((prev) => ({ ...prev, ...updated }))
              }
              setPage={setPage}
            />
          )}
        </aside>
      </main>
    </div>
  );
}

export default CourseDiscussion;