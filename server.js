if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express"); //create an express app, used to create a server and handle http requests
const app = express(); //is an instance of express
const bcrypt = require("bcrypt");

const initializePassport = require("./passport-config");
const session = require("express-session");
const flash = require("express-flash");

initializePassport(passport, (email) =>
  users.find((user) => user.email === email)
);

require("dotenv").config();
const PORT = process.env.PORT || 7777;
const cors = require("cors");
const bodyParser = require("body-parser");

const users = [];

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true,
  })
);

app.post("/signup", async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log(users);
    res.redirect("/login");
  } catch (e) {
    console.log(e), res.redirect("/signup");
  }
});

//routes
app.get("/", (req, res) => {
  res.send("GET request to.. the server is running");
});

app.get("/login", (req, res) => {
  res.send("login page");
});

app.get("/signup", (req, res) => {
  res.send("signup page");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
