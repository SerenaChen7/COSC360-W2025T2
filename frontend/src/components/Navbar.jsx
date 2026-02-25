import homeIcon from "../assets/home-icon.png";
import notificationsIcon from "../assets/notifications-icon.png";
import dashboardIcon from "../assets/darhboard-icon.png";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navRight">
        <button className="navIconBtn" onClick={() => (window.location.href = "/home")}>
          <img src={homeIcon} alt="Home" />
        </button>

        <button className="navIconBtn" onClick={() => (window.location.href = "/notifications")}>
          <img src={notificationsIcon} alt="Notifications" />
        </button>

        <button className="navIconBtn" onClick={() => (window.location.href = "/dashboard")}>
          <img src={dashboardIcon} alt="Dashboard" />
        </button>

<button className="navLoginBtn">Login</button>      </div>
    </nav>
  );
}