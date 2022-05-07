const passport = require('passport');
const User = require('../models/User');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    var profileData = {
        name : profile._json.name,
        username : profile._json.given_name,
        email : profile._json.email,
        avatar : profile._json.picture
    };
    try {
        const user = await User.findOne({email : profile._json.email});
        if(!user){
          const addedUser = await User.create(profileData);
          return cb(null,addedUser);
        }
        return  cb(null,user);
      } catch (error) {
        cb(error);
      }
  }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});
  
