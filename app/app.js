import "dotenv/config";
import express from "express";
import session from "express-session";
import ejsLayouts from "express-ejs-layouts";
import dashboardRoute from "./routes/dashboard.js";
import { isLoggedIn, loginRequired, adminRequired } from "./utils.js";
import {
  isValidCredentials,
  getCredentialsByUsername,
} from "./database/credentials.js";
import { getUserRoleById } from "./database/roles.js";

const app = express();

// TODO: Save into a database
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1-hour session
  }),
);

app.use(express.static("./app/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./app/pages");
app.use(ejsLayouts);
app.set("layout", false);

/* ##### LOGIN REQUIRED ROUTS START ##### */

app.use("/dashboard", loginRequired, adminRequired);

/* ##### LOGIN REQUIRED ROUTS END ##### */

app.use("/dashboard", dashboardRoute);

app.get("/", (req, res) => {
  res.render("home", { isLoggedIn: !isLoggedIn(req) });
});

app.get("/login", (req, res) => {
  if (isLoggedIn(req)) return res.redirect("/");

  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (isValidCredentials(username, password)) {
      const id = (await getCredentialsByUsername(username)).user_id;
      const role = (await getUserRoleById(id)).name;

      req.session.username = username;
      req.session.role = role;

      const redirectTo = req.session.returnTo || "/";
      delete req.session.returnTo;

      res.redirect(redirectTo);
    } else {
      res.redirect("/login#invalid");
    }
  } catch (err) {
    res.send(`Error: ${err.message}`).status(500);
    console.error(err);
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/#logout-success");
});

export default app;
