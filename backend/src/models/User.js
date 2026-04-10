import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Unique, Required username
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    // Unique, Required email for authentication
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    // Security: Stores the hashed version of the password
    passwordHash: {
      type: String,
      required: true
    },
    // System-level access control
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    profileImage: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: "",
      maxlength: 300,
      trim: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },{
    // Automatically adds createdAt and updatedAt fields (Auto-timestamp)
    timestamps: true
  });

export default mongoose.model("User", userSchema);