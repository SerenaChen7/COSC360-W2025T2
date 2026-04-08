import homeIcon from "../assets/home-icon.png";
import notificationsIcon from "../assets/notifications-icon.png";
import dashboardIcon from "../assets/darhboard-icon.png";
import "./Navbar.css";

export default function Navbar({ setPage, setCurrentUser, setRole }) {

    // We check if the user is logged in by looking for a "user" object in localStorage. If it exists, we consider the user to be logged in.
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!storedUser;

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
                
        {/* Home */}
        <button
          className="navIconBtn"
          onClick={() =>
            setPage ? setPage("home") : (window.location.href = "/home")
          }
        >
          <img src={homeIcon} alt="Home" />
        </button>

        {/* Notifications */}
        <button
          className="navIconBtn"
          onClick={() => (window.location.href = "/notifications")}
        >
          <img src={notificationsIcon} alt="Notifications" />
        </button>

        {/* Dashboard */}
        <button
          className="navIconBtn"
          onClick={() =>
            setPage ? setPage("dashboard") : (window.location.href = "/dashboard")
          }
        >
          <img src={dashboardIcon} alt="Dashboard" />
        </button>

                {/* Login/Logout */}

        {isLoggedIn && (
          <img
            className="navProfilePic"
            src={
              storedUser.profileImage
                ? `${import.meta.env.VITE_API_URL}${storedUser.profileImage}`
                : "https://via.placeholder.com/32"
            }
            alt="Profile"
          />
        )}

        {isLoggedIn ? (
          <button className="navLoginBtn" onClick={handleLogout}>
            LOGOUT
          </button>
        ) : (
          <button
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