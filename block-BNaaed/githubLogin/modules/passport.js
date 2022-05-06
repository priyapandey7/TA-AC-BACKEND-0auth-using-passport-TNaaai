const passport = require('passport');
const User = require('../models/User');

var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  },
  async (accessToken, refreshToken, profile, cb)=>  {
    console.log(profile);
    var profileData = {
        name : profile._json.name,
        username : profile._json.login,
        email : profile._json.email,
        avatar : profile._json.avatar_url
    };
    try {
        const user = await User.findOne({email : profile._json.email});
        if(!user){
            const addedUser = await User.create(profileData);
            return cb(null, addedUser);
        }
        return cb(null,user);
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
