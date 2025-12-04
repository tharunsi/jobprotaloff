import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { user } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALL_BACK_ID
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create a user in your database
      const existingUser = await user.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
       const newUser = await user.create({
      name: profile.displayName || 'No Name',
      mail: email || undefined,
      googleId: profile.id
    });
    return done(null, newUser);
      done(null, newUser);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const foundUser = await user.findById(id);
    done(null, foundUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport;