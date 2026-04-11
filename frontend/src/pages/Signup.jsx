import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { validateSignupForm } from "../utils/signupValidation";
import "./Login.css";

export default function Signup({ setPage }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setProfileImage(file || null);
  }

  async function handleSignup() {
    try {
      setLoading(true);
      setMessage("");

      const validationMessage = validateSignupForm({
        username,
        email,
        password,
        confirmPassword,
        profileImage
      });
      if (validationMessage) {
        setMessage(validationMessage);
        return;
      }

      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          body: formData
        });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Sign up failed");
        return;
      }

      setMessage("Account created successfully. Please log in.");

      setTimeout(() => {
        setPage("login");
      }, 1200);
    } catch (error) {
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !loading) {
      handleSignup();
    }
  }

  return (
    <div className="loginPage">
      <Header />
      <Navbar setPage={setPage} />

      <main className="loginMain">
        <button
          className="linkText"
          type="button"
          onClick={() => setPage("login")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer"
          }}
        >
          ← Back to Login
        </button>

        <h2 className="loginTitle">Create an account</h2>

        <div className="loginGrid">
          <div className="formSide">
            <div className="field">
              <div className="label">USERNAME</div>
              <input
                className="lineInput"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
              />
            </div>

            <div className="field">
              <div className="label">EMAIL ADDRESS</div>
              <input
                className="lineInput"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
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
                  onKeyDown={handleKeyDown}
                  autoComplete="new-password"
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
              <div className="hintText">
                8-16 characters, include uppercase, lowercase, number, and special character
              </div>
            </div>

            <div className="field">
              <div className="label">CONFIRM PASSWORD</div>

              <div className="passwordRow">
                <input
                  className="lineInput"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="eyeBtn"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  👁
                </button>
              </div>
            </div>

            <div className="field">
              <div className="label">PROFILE IMAGE</div>
              <input
                className="lineInput"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
              />
            </div>

            <button
              className="loginBtn"
              type="button"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>

            {message && <p className="loginMessage">{message}</p>}
          </div>

          <div className="orCol">

          </div>

          <div className="socialSide">
            <button
              className="socialBtn"
              type="button"
              onClick={() => setPage("login")}
            >
              Already have an account? Log in
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
