const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("./models/user");

// Custom login verification with passport
module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      (username, password, done) => {
        // Match user
        console.log("verification function called.");
        User.findOne({
          username: username,
        }).then((user) => {
          if (!user) {
            return done(null, false, {
              message: "User does not exist",
            });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect Password" });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
