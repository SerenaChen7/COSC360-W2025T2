import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import "./AdminUsers.css";

function AdminUsers({ setPage, currentUser, setCurrentUser, setRole }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSearch = async () => {
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
          headers: { Authorization: `Bearer ${token}` }
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

  const handleToggleUserStatus = async (targetUserId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/users/${targetUserId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update user status");
      }

      setResults((prev) =>
        prev.map((user) => (user._id === targetUserId ? data.user : user))
      );
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to update user status");
    }
  };

  return (
    <div className="admin-users-page">
      <Header />
      <Navbar
        setPage={setPage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setRole={setRole}
      />

      <main className="admin-users-content">
        <div className="admin-users-card">
          <h2>User Management</h2>
          <p className="admin-users-subtitle">
            Search and manage user accounts
          </p>

          <div className="admin-users-search-row">
            <input
              type="text"
              className="admin-users-input"
              placeholder="Search by username, email, or post keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              type="button"
              className="admin-users-search-btn"
              onClick={handleSearch}
              disabled={searching}
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>

          {message && <p className="admin-users-message">{message}</p>}

          {results.length > 0 && (
            <div className="admin-users-results">
              {results.map((user) => (
                <div className="admin-users-row" key={user._id}>
                  <div className="admin-users-avatar">
                    {user.profileImage ? (
                      <img
                        src={`${API_URL}${user.profileImage}`}
                        alt={user.username}
                        className="admin-users-avatar-img"
                      />
                    ) : (
                      user.username?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="admin-users-info">
                    <p className="admin-users-name">{user.username}</p>
                    <p className="admin-users-email">{user.email}</p>
                    <p className="admin-users-role">
                      {user.role} {user.isDisabled ? "• disabled" : "• active"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className={`admin-status-button ${user.isDisabled ? "enable" : "disable"}`}
                    onClick={() => handleToggleUserStatus(user._id)}
                  >
                    {user.isDisabled ? "Enable" : "Disable"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminUsers;
