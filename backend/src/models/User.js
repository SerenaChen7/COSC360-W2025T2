import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // passwordHash is now optional for social users
  passwordHash: { type: String, required: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // Added fields for social providers
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  appleId: { type: String, unique: true, sparse: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);