import { useEffect, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

import googleIcon from "../assets/google-icon.png";
import appleIcon from "../assets/apple-icon.png";
import facebookIcon from "../assets/facebook-icon.png";

import "./Login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Only on this page: make navbar Login refresh
    const loginBtn = document.querySelector(".navLoginText") || document.querySelector(".navLoginBtn");
    if (loginBtn) loginBtn.onclick = () => window.location.reload();
  }, []);

  return (
    <div className="loginPage">
      <Header />
      <Navbar />

      <main className="loginMain">
        <a className="linkText" href="/go-back">
          ← Go Back
        </a>

        <h2 className="loginTitle">Log into this website</h2>

        <div className="loginGrid">
          {/* LEFT */}
          <div className="formSide">
            <div className="field">
              <div className="label">EMAIL ADDRESS</div>
              <input className="lineInput" type="email" placeholder="Email Address" />
            </div>

            <div className="field">
              <div className="label">PASSWORD</div>

              <div className="passwordRow">
                <input
                  className="lineInput"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

            <button className="loginBtn" type="button">
              LOG IN
            </button>
          </div>

          {/* OR */}
          <div className="orCol">
            <div className="orLine" />
            <div className="orText">OR</div>
            <div className="orLine" />
          </div>

          {/* RIGHT */}
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

        <a className="linkText cantLogin" href="/cant-login">
          CAN&apos;T LOG IN?
        </a>
      </main>
    </div>
  );
}