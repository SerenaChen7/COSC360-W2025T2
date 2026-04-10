import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
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

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$/;
  function handleImageChange(e) {
    const file = e.target.files[0];
    setProfileImage(file || null);
  }
  function validateSignup() {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password || !confirmPassword) {
      return "Please fill in all fields";
    }

    if (trimmedUsername.length < 3) {
      return "Username must be at least 3 characters";
    }

    if (trimmedUsername.length > 30) {
      return "Username must be 30 characters or less";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return "Please enter a valid email address";
    }

    if (!passwordRegex.test(password)) {
      return "Password must be 8-16 characters and include uppercase, lowercase, number, and special character";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    if (profileImage) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(profileImage.type)) {
        return "Profile image must be JPG, PNG, or WEBP";
      }

      const maxSize = 5 * 1024 * 1024;
      if (profileImage.size > maxSize) {
        return "Profile image must be smaller than 5MB";
      }
    }

    return "";
  }

  async function handleSignup() {
    try {
      setLoading(true);
      setMessage("");

      const validationMessage = validateSignup();
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
            <div className="orLine" />
            <div className="orText">OR</div>
            <div className="orLine" />
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