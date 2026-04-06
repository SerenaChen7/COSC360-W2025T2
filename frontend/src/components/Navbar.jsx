import homeIcon from "../assets/home-icon.png";
import notificationsIcon from "../assets/notifications-icon.png";
import dashboardIcon from "../assets/darhboard-icon.png";
import "./Navbar.css";

export default function Navbar({ setPage, currentUser, setCurrentUser, setRole }) {
  // The handleLogout function clears the user's authentication token and information from localStorage
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (setCurrentUser) setCurrentUser(null);
    if (setRole) setRole("guest");
    if (setPage) setPage("home");

    setTimeout(() => {
      window.alert("Logout successfully");
    }, 50);
  };

  return (
    <nav className="navbar">
      <div className="navRight">
        <button className="navIconBtn" onClick={() => setPage ? setPage("home") : (window.location.href = "/home")}>
          <img src={homeIcon} alt="Home" />
        </button>

        <button className="navIconBtn" onClick={() => (window.location.href = "/notifications")}>
          <img src={notificationsIcon} alt="Notifications" />
        </button>

        <button className="navIconBtn" onClick={() => setPage ? setPage("dashboard") : (window.location.href = "/dashboard")}>
          <img src={dashboardIcon} alt="Dashboard" />
        </button>

        //If a user is logged in, it shows Logout; otherwise, it shows Login.
        {currentUser ? (
          <button className="navLoginBtn" onClick={handleLogout}>
            LOGOUT
          </button>
        ) : (
          <button className="navLoginBtn" onClick={() => setPage("login")}>
            LOGIN
          </button>
        )}
      </div>
    </nav>
  );
}