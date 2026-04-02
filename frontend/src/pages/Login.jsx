import { useEffect, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

import googleIcon from "../assets/google-icon.png";
import appleIcon from "../assets/apple-icon.png";
import facebookIcon from "../assets/facebook-icon.png";

import "./Login.css";

export default function Login({ setPage, setRole, setCurrentUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loginBtn =
      document.querySelector(".navLoginText") ||
      document.querySelector(".navLoginBtn");

    if (loginBtn) loginBtn.onclick = () => window.location.reload();
  }, []);

  async function handleLogin() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);

      if (data.user?.role) {
        setRole(data.user.role);
      } else {
        setRole("user");
      }
        setPage("home");
     
    } catch (error) {
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginPage">
      <Header />
      <Navbar />

      <main className="loginMain">
        <button
          className="linkText"
          type="button"
          onClick={() => setPage("cover")}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          ← Go Back
        </button>

        <h2 className="loginTitle">Log into this website</h2>

        <div className="loginGrid">
          <div className="formSide">
            <div className="field">
              <div className="label">EMAIL ADDRESS</div>
              <input
                className="lineInput"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="label">PASSWORD</div>

              <div className="passwordRow">
                <input
                  className="lineInput"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="eyeBtn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  👁
                </button>
              </div>
            </div>

            <button
              className="loginBtn"
              type="button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>

            {message && <p className="loginMessage">{message}</p>}
          </div>

          <div className="orCol">
            <div className="orLine" />
            <div className="orText">OR</div>
            <div className="orLine" />
          </div>

          <div className="socialSide">
            <button className="socialBtn" type="button">
              <img src={googleIcon} alt="Google" />
              Continue with Google
            </button>

            <button className="socialBtn" type="button">
              <img src={appleIcon} alt="Apple" />
              Continue with Apple
            </button>

            <button className="socialBtn" type="button">
              <img src={facebookIcon} alt="Facebook" />
              Continue with Facebook
            </button>
          </div>
        </div>

        <button
          className="linkText cantLogin"
          type="button"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          CAN&apos;T LOG IN?
        </button>
      </main>
    </div>
  );
}