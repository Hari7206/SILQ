import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config.js";
import userModel from "../model/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await userModel.findOne({ email });

        if (user) {
          const needsProfileCompletion = !user.contact;
          
          return done(null, {
            ...user.toObject(),
            needsProfileCompletion
          });
        }

        user = await userModel.create({
          fullname: profile.displayName,
          email,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value || null,
          provider: "google",
          role: "buyer",       
          contact: null,      
        });

    
        return done(null, {
          ...user.toObject(),
          needsProfileCompletion: true
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;