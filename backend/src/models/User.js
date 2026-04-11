import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Unique, Required username with validation from team
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    // Unique, Required email for authentication with regex validation
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
      default: null
    },
    // Social Login IDs
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true
    },
    // System-level access control
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    // Unified field for social avatar URLs and local upload paths
    profileImage: {
      type: String,
      default: ""
    },
    // Added by teammate
    bio: {
      type: String,
      default: "",
      maxlength: 300,
      trim: true
    },
    // Added by teammate for course favorites
    favorites: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course"
        }
      ],
      default: []
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);