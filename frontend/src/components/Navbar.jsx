import { useState, useEffect } from "react";
import homeIcon from "../assets/home-icon.png";
import notificationsIcon from "../assets/notifications-icon.png";
import dashboardIcon from "../assets/darhboard-icon.png";
import "./Navbar.css";

export default function Navbar({ setPage, setCurrentUser, setRole }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifBox, setShowNotifBox] = useState(false);

  // Safe parsing
  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const storedUser = getStoredUser();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!storedUser;

  const fetchNotifications = () => {
    if (!isLoggedIn || !token) return;
    fetch("http://localhost:3000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array before setting state
        setNotifications(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [isLoggedIn, token]);

  const markAllAsRead = async () => {
    if (!token || notifications.filter(n => !n.isRead).length === 0) return;
    
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    try {
      const res = await fetch("http://localhost:3000/api/notifications/read-all", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        // Revert on failure
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchNotifications();
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:3000/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    localStorage.clear();
    if (setCurrentUser) setCurrentUser(null);
    if (setRole) setRole("guest");
    if (setPage) setPage("login");
  };

  // Toggle box and optionally mark as read
  const toggleNotifBox = () => {
    const nextState = !showNotifBox;
    setShowNotifBox(nextState);

  };

  return (
    <nav className="navbar">
      <div className="navRight">
        <button className="navIconBtn" onClick={() => setPage("home")}>
          <img src={homeIcon} alt="Home" />
        </button>

        <div className="notif-wrapper">
          <button className="navIconBtn" onClick={toggleNotifBox}>
            <img src={notificationsIcon} alt="Notifications" />
            {unreadCount > 0 && <span className="notif-badge-red">{unreadCount}</span>}
          </button>

          {showNotifBox && (
            <div className="notif-dropdown-box">
              <div className="notif-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button className="mark-all-btn" onClick={markAllAsRead}>
                    Mark All As Read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <p className="notif-empty-text">No messages</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className={`notif-item-row ${n.isRead ? 'read' : 'unread'}`}>
                      <span className="notif-message">{n.message}</span>
                      <button 
                        className="notif-delete-btn"
                        onClick={(e) => deleteNotification(e, n._id)}
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="navIconBtn" onClick={() => setPage("dashboard")}>
          <img src={dashboardIcon} alt="Dashboard" />
        </button>

        {isLoggedIn ? (
          <button className="navLoginBtn" onClick={handleLogout}>LOGOUT</button>
        ) : (
          <button className="navLoginBtn" onClick={() => setPage("login")}>LOGIN</button>
        )}
      </div>
    </nav>
  );
}