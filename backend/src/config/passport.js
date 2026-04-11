import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js'; 

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      // Extract profile picture URL from Google profile
      const avatarUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "";

      // Find user by Google ID or Email
      let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: email }] });

      if (!user) {
        // Create new user if they don't exist
        user = await User.create({
          username: `${profile.displayName}_${profile.id.slice(-4)}`,
          email: email,
          googleId: profile.id,
          profileImage: avatarUrl, // Store social avatar URL
          passwordHash: null
        });
      } else {
        // Update existing user if social info or image is missing
        let isUpdated = false;
        if (!user.googleId) {
          user.googleId = profile.id;
          isUpdated = true;
        }
        if (!user.profileImage) {
          user.profileImage = avatarUrl;
          isUpdated = true;
        }
        if (isUpdated) await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos'] // Ensure 'photos' is requested
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
      // Extract profile picture URL from Facebook profile
      const avatarUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "";

      let user = await User.findOne({ $or: [{ facebookId: profile.id }, { email: email }] });

      if (!user) {
        // Create new user
        user = await User.create({
          username: `${profile.displayName}_${profile.id.slice(-4)}`,
          email: email,
          facebookId: profile.id,
          profileImage: avatarUrl, // Store social avatar URL
          passwordHash: null
        });
      } else {
        // Sync social ID and image for existing users
        let isUpdated = false;
        if (!user.facebookId) {
          user.facebookId = profile.id;
          isUpdated = true;
        }
        if (!user.profileImage) {
          user.profileImage = avatarUrl;
          isUpdated = true;
        }
        if (isUpdated) await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

export default passport;