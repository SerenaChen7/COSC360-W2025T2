import { useState } from "react";
import "./AdminActions.css";
import EditCourseModal from "./EditCourseModal";

function AdminActions({ courseId, course, onCourseUpdated, managingMembers, onToggleManage }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Hub forever?");

    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/api/courses/${courseId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Hub deleted successfully!");
          window.location.href = "/";
        } else {
          alert("Failed to delete. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const handleSearchUsers = async () => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setMessage("Enter a username, email, or post keyword.");
      return;
    }

    setSearching(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/users/search?q=${encodeURIComponent(trimmed)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to search users");
      }

      setResults(data);

      if (data.length === 0) {
        setMessage("No users found.");
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      setMessage(err.message || "Search failed.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <div className="admin-actions-card">
        <h3>ACTIONS</h3>

        <button className="admin-action-button" onClick={() => setShowEdit(true)}>
          Edit Hub
        </button>

        {onToggleManage && (
          <button className="admin-action-button" onClick={onToggleManage}>
            {managingMembers ? "Done Managing" : "Manage Members"}
          </button>
        )}

        <button className="admin-action-button danger" onClick={handleDelete}>
          Delete Hub 🗑️
        </button>

        <button
          className="admin-action-button"
          onClick={() => setShowUserSearch((prev) => !prev)}
        >
          {showUserSearch ? "Hide User Search" : "Search Users"}
        </button>

        {showUserSearch && (
          <div className="admin-search-panel inside-actions">
            <p className="admin-search-helper">
              Search by username, email, or post keyword
            </p>

            <div className="admin-search-row">
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchUsers();
                  }
                }}
              />
              <button
                type="button"
                className="admin-search-button"
                onClick={handleSearchUsers}
                disabled={searching}
              >
                {searching ? "Searching..." : "Go"}
              </button>
            </div>

            {message && <p className="admin-search-message">{message}</p>}

            {results.length > 0 && (
              <div className="admin-search-results">
                {results.map((user) => (
                  <div className="admin-search-user" key={user._id}>
                    <div className="admin-search-avatar">
                      {user.profileImage ? (
                        <img
                          src={`${API_URL}${user.profileImage}`}
                          alt={user.username}
                          className="admin-search-avatar-img"
                        />
                      ) : (
                        user.username?.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="admin-search-user-info">
                      <p className="admin-search-name">{user.username}</p>
                      <p className="admin-search-email">{user.email}</p>
                      <p className="admin-search-role">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showEdit && course && (
        <EditCourseModal
          course={course}
          onClose={() => setShowEdit(false)}
          onUpdated={(updated) => {
            onCourseUpdated?.(updated);
            setShowEdit(false);
          }}
        />
      )}
    </>
  );
}

export default AdminActions;