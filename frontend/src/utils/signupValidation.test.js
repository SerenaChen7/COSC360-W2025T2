import { describe, expect, it } from "vitest";
import { validateSignupForm } from "./signupValidation.js";

describe("signupValidation", () => {
  it("should require all mandatory fields", () => {
    expect(validateSignupForm({})).toBe("Please fill in all fields");
  });

  it("should validate the username length", () => {
    expect(
      validateSignupForm({
        username: "ab",
        email: "eric@example.com",
        password: "@Password1",
        confirmPassword: "@Password1"
      })
    ).toBe("Username must be at least 3 characters");
  });

  it("should validate the email format", () => {
    expect(
      validateSignupForm({
        username: "Eric",
        email: "not-an-email",
        password: "@Password1",
        confirmPassword: "@Password1"
      })
    ).toBe("Please enter a valid email address");
  });

  it("should validate the password rules", () => {
    expect(
      validateSignupForm({
        username: "Eric",
        email: "eric@example.com",
        password: "password",
        confirmPassword: "password"
      })
    ).toBe(
      "Password must be 8-16 characters and include uppercase, lowercase, number, and special character"
    );
  });

  it("should validate password confirmation", () => {
    expect(
      validateSignupForm({
        username: "Eric",
        email: "eric@example.com",
        password: "@Password1",
        confirmPassword: "@Password2"
      })
    ).toBe("Passwords do not match");
  });

  it("should validate the profile image type", () => {
    expect(
      validateSignupForm({
        username: "Eric",
        email: "eric@example.com",
        password: "@Password1",
        confirmPassword: "@Password1",
        profileImage: {
          type: "image/gif",
          size: 10
        }
      })
    ).toBe("Profile image must be JPG, PNG, or WEBP");
  });

  it("should validate the profile image size", () => {
    expect(
      validateSignupForm({
        username: "Eric",
        email: "eric@example.com",
        password: "@Password1",
        confirmPassword: "@Password1",
        profileImage: {
          type: "image/png",
          size: 6 * 1024 * 1024
        }
      })
    ).toBe("Profile image must be smaller than 5MB");
  });

  it("should accept valid signup input", () => {
    expect(
      validateSignupForm({
        username: "Eric",
        email: "eric@example.com",
        password: "@Password1",
        confirmPassword: "@Password1",
        profileImage: {
          type: "image/png",
          size: 1024
        }
      })
    ).toBe("");
  });
});
