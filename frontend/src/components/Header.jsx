import ubcLogo from "../assets/UBCLogo.jpg";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <img src={ubcLogo} alt="UBC Logo" className="headerLogo" />
      <div className="headerTitle">Together As One</div>
    </header>
  );
}