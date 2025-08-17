// access the env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStategy = require("passport-local");
const User = require("./models/user.js");

//here the router
const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");
// const { connect } = require("http2");

const dbUrl = process.env.ATLASDB_URl;

//create the connection with the database
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("dataBase successfully connected"))
  .catch((err) => {
    console.log(err);
  });

// app work start here

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("public"));

// store the session data in mongo

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET_CODE,
  },
  touchAfter: 24 * 3600,
});
store.on("error", (error) => {
  console.log("error in mongo session store", error);
});

// for session
let sessionOption = {
  store,
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
// session that store some cookies
app.use(session(sessionOption));
app.use(flash());
//passport authentication
app.use(passport.initialize());
app.use(passport.session()); // here we create the session for the user
passport.use(new LocalStategy(User.authenticate()));
//its two stategy to check the password authentication

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//use res.locals for store the flash message
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});
//root listing
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//set the router route
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//middleware for if page did not exist
app.use((req, res) => {
  res.status(404).render("error", { message: "Page not found" });
});

// Catch-all error handler
app.use((req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
});

app.listen(8080, () => {
  console.log("Your Listing port is 8080");
});
