const dotenv = require("dotenv");
const fs = require("fs");
const https = require("https");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const path = require("path");

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

const router = require("./api/");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const sessionStore = process.env.NODE_ENV !== "test" ? null : null;

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.use((req, res, next) => {
  next();
});

app.use("/", express.static("./build"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

if (process.env.NODE_ENV === "local") {
  var options = {
    key: fs.readFileSync(path.join(__dirname + "/certificates/key.pem")),
    cert: fs.readFileSync(path.join(__dirname + "/certificates/cert.pem")),
  };
  https.createServer(options, app).listen(port, function () {
    // eslint-disable-next-line no-console

    // eslint-disable-next-line no-console
    console.log("Enviroment: " + port);
  });
} else {
  // serve the react app files
  app.use(express.static("./build"));

  app.get("*", (req, res) => {
    res.sendFile("./build/index.html");
  });

  app.listen(process.env.PORT, () => {
    console.log(`**** HTTPS ${process.env.NODE_ENV} Listening on port ${port}`);
  });
}

module.exports = app;
