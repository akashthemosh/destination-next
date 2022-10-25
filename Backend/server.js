const express = require("express");
const app = express(); // server software
const bodyParser = require("body-parser"); // parser middleware
const path = require("path");

const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const session = require("express-session"); // session middleware
const passport = require("passport");

require("./passport")(passport);

const User = require("./models/user"); // User Model

const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

//for environment vars
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.log("Error connecting with error code:", err);
  });

//passport local strategy
const LocalStrategy = require("passport-local").Strategy;

// Configure Sessions Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// added for req.isAuthenticated
app.set("trust proxy", 1);

// Configuring More Middleware
const bcrypt = require("bcryptjs");

// Authentication call
app.get("/auth", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("check auth: ", req.isAuthenticated());
    res.json({
      success: true,
      username: req.user.username,
      id: req.user.id,
    });
  } else {
    console.log("check auth: ", req.isAuthenticated());
    res.json({
      success: false,
      username: null,
      id: null,
    });
  }
});

// Route to Log out
app.get("/logout", (req, res) => {
  req.logout();
  res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

//Post Route: signup
app.post("/signup", (req, res) => {
  const username = req.body.user.username;
  const fname = req.body.user.fname;
  const lname = req.body.user.lname;
  const email = req.body.user.email;
  const password = req.body.user.password;

  console.log("here ia m");

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        const newUser = new User({
          username,
          fname,
          lname,
          email,
          password,
        });
        //Hash password before saving in database
        bcrypt
          .genSalt(10)
          .then((salt) => {
            return bcrypt.hash(newUser.password, salt);
          })
          .then((hash) => {
            newUser.password = hash;
            newUser.save().then((user) => {
              res.json({
                success: true,
                message: "Signed up successfully.",
              });
            });
          })
          .catch((err) => {
            res.json({
              success: false,
              message: `Error: ${err}`,
            });
          });
      } else {
        res.json({
          success: false,
          message: "A user with the given username already exists.",
        });
      }
    })
    .catch((err) => {
      res.json({
        success: false,
        message: `Error: ${err}`,
      });
    });
});

//Post Route: login
app.post("/login", (req, res, next) => {
  console.log(req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({
        success: false,
        message: info.message,
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        success: true,
        message: "login successful",
        user: user,
      });
    });
  })(req, res, next);
});

app.use("/destinations", require("./routes/destination-routes"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
