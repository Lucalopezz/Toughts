const express = require("express");
const flash = require("express-flash");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const path = require('path');

const toughtsRoutes = require("./routes/toughtsRoutes");
const ToughtController = require("./controllers/ToughtController");

const app = express();
// database connection
const conn = require("./database/conn");

// Models
const Toughts = require("./models/Tought");
const User = require("./models/Tought");

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
// session configuration
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: () => {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 360000, // one day
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);
// flash message
app.use(flash());

// public path, css
app.use(express.static("public"));

// set session to res
app.use((req, res, next) => {
  if (req.session.userid) {
    // in case user is log
    res.locals.session = req.session;
  }

  next(); // if not logged
});


// Routes
app.use("/toughts", toughtsRoutes); // people logged in

app.get("/", ToughtController.showToughts); //show toughts people no logged in


conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
