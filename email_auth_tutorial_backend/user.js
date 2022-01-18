const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const PassportLocalStrategy = require('passport-local');

const UserDetail = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  emailVerified: Boolean,
  emailVerificationHash: String
});

UserDetail.plugin(passportLocalMongoose);

const UserDetails = mongoose.model('user', UserDetail, 'user');

passport.use(new PassportLocalStrategy(
  function(username, password, done) {
    UserDetails.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      user.authenticate(password, function(err,model,passwordError){
        if(passwordError){
            console.log(err)
            done(null, false);
        } else if(model) {
            done(null, user);
        }
    })
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializing user: ');
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  UserDetails.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = { UserDetails };