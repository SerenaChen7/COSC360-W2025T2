import { useEffect } from "react";
import homeIcon from "../assets/home-icon.png";
import notificationsIcon from "../assets/notifications-icon.png";
import dashboardIcon from "../assets/darhboard-icon.png";
import "./Navbar.css";

export default function Navbar({
  setPage,
  setCurrentUser,
  setRole,
  onProfileClick
}) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!storedUser;

  useEffect(() => {
    if (!isLoggedIn) return;

    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          localStorage.removeItem("user");
          localStorage.removeItem("joinedCourseIds");

          if (setCurrentUser) setCurrentUser(null);
          if (setRole) setRole("guest");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("joinedCourseIds");

          if (setCurrentUser) setCurrentUser(null);
          if (setRole) setRole("guest");
          if (setPage) setPage("login");

          if (res.status === 403) {
            window.alert("Your account has been disabled by an admin.");
          } else {
            window.alert("Your session expired. Please log in again.");
          }
          return;
        }

        if (!res.ok) return;

        const data = await res.json();

        if (data?.user?.isDisabled) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("joinedCourseIds");

          if (setCurrentUser) setCurrentUser(null);
          if (setRole) setRole("guest");
          if (setPage) setPage("login");

          window.alert("Your account has been disabled by an admin.");
        }
      } catch (error) {
        console.error("Failed to check user status:", error);
      }
    };

    checkUserStatus();
    const intervalId = setInterval(checkUserStatus, 5000);

    return () => clearInterval(intervalId);
  }, [isLoggedIn, setCurrentUser, setRole, setPage]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("joinedCourseIds");

    if (setCurrentUser) setCurrentUser(null);
    if (setRole) setRole("guest");
    
    if (setPage) {
      setPage("login"); 
    }
    
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <nav className="navbar">
      <div className="navRight">
        <button
          type="button"
          className="navIconBtn"
          onClick={() =>
            setPage ? setPage("home") : (window.location.href = "/home")
          }
        >
          <img src={homeIcon} alt="Home" />
        </button>


        <button
          type="button"
          className="navIconBtn"
          onClick={() => {
            if (!isLoggedIn) {
              if (setPage) setPage("login");
              return;
            }

            if (setPage) {
              setPage("dashboard");
            } else {
              window.location.href = "/dashboard";
            }
          }}
        >
          <img src={dashboardIcon} alt="Dashboard" />
        </button>

        {isLoggedIn && (
          <button
            type="button"
            className="navIconBtn"
            onClick={onProfileClick}
            style={{ padding: 0, background: "none", border: "none" }}
          >
            <img
              className="navProfilePic"
              src={
                storedUser.profileImage
                  ? (storedUser.profileImage.startsWith("http")
                    ? storedUser.profileImage
                    : `${import.meta.env.VITE_API_URL}${storedUser.profileImage}`)
                  : "https://via.placeholder.com/32"
              }
              alt="Profile"
            />
          </button>
        )}

        {isLoggedIn ? (
          <button type="button" className="navLoginBtn" onClick={handleLogout}>
            LOGOUT
          </button>
        ) : (
          <button
            type="button"
            className="navLoginBtn"
            onClick={() => setPage && setPage("login")}
          >
            LOGIN
          </button>
        )}
      </div>
    </nav>
  );
}