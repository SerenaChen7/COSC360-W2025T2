const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$/;

export function validateSignupForm({
  username = "",
  email = "",
  password = "",
  confirmPassword = "",
  profileImage = null
}) {
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
