const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities/");

const session = require("express-session");
const flash = require("connect-flash");
const expressMessages = require("express-messages");
const pool = require("./database/");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

/* ***********************
 * Middleware Section
 *************************/

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser (needed for JWT)
app.use(cookieParser());

// Session (used for flash messages only)
app.set("trust proxy", 1); // ✅ REQUIRED for Render (HTTPS)

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET, // ✅ FIXED
    resave: false, // 🔥 better
    saveUninitialized: false, // 🔥 better
    name: "sessionId",
    cookie: {
      secure: true, // ✅ required on Render (HTTPS)
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  }),
);

// Flash + Messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

// 🔥 JWT Middleware (GLOBAL — DO NOT REMOVE)
app.use(utilities.checkJWTToken);

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

/* ***********************
 * Routes
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

/* ***********************
 * 404 Not Found Route
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = "";

  try {
    nav = await utilities.getNav();
  } catch (navError) {
    console.error("Navigation error:", navError.message);
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Server Listener
 *************************/
const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
