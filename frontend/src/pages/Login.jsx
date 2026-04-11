import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

import googleIcon from "../assets/google-icon.png";
import facebookIcon from "../assets/facebook-icon.png";

import "./Login.css";

export default function Login({ setPage, setRole, setCurrentUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Standard Login Handler
  async function handleLogin() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // Save credentials
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setCurrentUser(data.user);
      setRole(data.user?.role || "user");
      setPage("home");
    } catch (error) {
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  // Social Login Handler
  function handleSocialLogin(platform) {
    const provider = platform.toLowerCase();
    // Redirect to backend passport route
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${provider}`;
  }

  return (
    <div className="loginPage">
      <Header />
      <Navbar
        setPage={setPage}
        setCurrentUser={setCurrentUser}
        setRole={setRole}
      />

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
            <button
              className="socialBtn"
              type="button"
              onClick={() => handleSocialLogin("Google")}
            >
              <img src={googleIcon} alt="Google" />
              Continue with Google
            </button>
            <button
              className="socialBtn"
              type="button"
              onClick={() => handleSocialLogin("Facebook")}
            >
              <img src={facebookIcon} alt="Facebook" />
              Continue with Facebook
            </button>
          </div>
        </div>

        <button
          className="linkText cantLogin"
          type="button"
          onClick={() => setPage("signup")}
        >
          DON&apos;T HAVE AN ACCOUNT? SIGN UP
        </button>
      </main>
    </div>
  );
}