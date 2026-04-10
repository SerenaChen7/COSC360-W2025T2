import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import AppleStrategy from 'passport-apple';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: email }] });

      if (!user) {
        user = await User.create({
          username: `${profile.displayName}_${profile.id.slice(-4)}`,
          email: email,
          googleId: profile.id,
          passwordHash: null
        });
      } else if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`;
      let user = await User.findOne({ $or: [{ facebookId: profile.id }, { email: email }] });

      if (!user) {
        user = await User.create({
          username: `${profile.displayName}_${profile.id.slice(-4)}`,
          email: email,
          facebookId: profile.id,
          passwordHash: null
        });
      } else if (!user.facebookId) {
        user.facebookId = profile.id;
        await user.save();
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
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ $or: [{ facebookId: profile.id }, { email: profile.emails[0].value }] });
      if (!user) {
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          facebookId: profile.id,
          passwordHash: await bcrypt.hash(Math.random().toString(36), 10)
        });
      }
      return done(null, user);
    } catch (err) { return done(err, null); }
  }
));

// Apple Strategy
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_SERVICE_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyString: process.env.APPLE_PRIVATE_KEY, // or use privateKeyLocation
    callbackURL: "/api/auth/apple/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, idToken, profile, done) => {
    // Apple only sends profile on first login
    try {
      let user = await User.findOne({ appleId: profile.user });
      if (!user) {
        user = await User.create({
          username: profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : "Apple User",
          email: profile.email,
          appleId: profile.user,
          passwordHash: await bcrypt.hash(Math.random().toString(36), 10)
        });
      }
      return done(null, user);
    } catch (err) { return done(err, null); }
  }
));

export default passport;