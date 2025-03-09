import "dotenv/config"
import { v4 as uuidv4 } from "uuid"
import ejs from "ejs"
import express from "express"
import session from "express-session"
import MySQLStore from "express-mysql-session"
import ejsLayouts from "express-ejs-layouts"
import dashboardRoute from "./routes/dashboard.js"
import apiRoute from "./routes/api.js"
import { isLoggedIn, loginRequired, adminRequired, parseSettings } from "./utils.js"
import { isValidCredentials, getCredentialsByUsername } from "./database/credentials.js"
import { getUserRoleById } from "./database/roles.js"
import { getUserSettingsById } from "./database/settings.js"
import db from "./database/database.js"
import pg from "pg"
import pgSession from "connect-pg-simple"

ejs.delimiter = "/"
ejs.openDelimiter = "["
ejs.closeDelimiter = "]"

const app = express()

const PgStore = pgSession(session)
app.use(
  session({
    store: new PgStore({
      pool: db.getConnection() // Use PostgreSQL connection pool
    }),
    secret: process.env.SESSION_SECRET || "supersecretkey", // Use a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
)

app.use(express.static("./app/public"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set("views", "./app/pages")
app.use(ejsLayouts)

app.use(async (req, res, next) => {
  // Load settings into the session (only for users that are logged-in)
  if (req.session.username) {
    const user = (await getCredentialsByUsername(req.session.username)).rows[0]
    if (user.user_id) {
      req.session.settings = parseSettings((await getUserSettingsById(user.user_id)).rows)
    }
  }

  req.app.set("layout", false) // Set layout
  next()
})

/* ##### LOGIN REQUIRED ROUTS START ##### */

app.use("/dashboard", loginRequired, adminRequired)

/* ##### LOGIN REQUIRED ROUTS END ##### */

app.use("/dashboard", dashboardRoute)
app.use("/api", apiRoute)

app.get("/", (req, res) => {
  res.render("home", { isLoggedIn: !isLoggedIn(req) })
})

app.get("/login", async (req, res) => {
  if (isLoggedIn(req)) return res.redirect("/")

  res.render("login")
})

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (await isValidCredentials(username, password)) {
      const id = (await getCredentialsByUsername(username)).rows[0].user_id
      const role = (await getUserRoleById(id)).rows[0].name

      req.session.username = username
      req.session.role = role

      const redirectTo = req.session.returnTo || "/"
      delete req.session.returnTo

      res.redirect(redirectTo)
    } else {
      res.redirect("/login#invalid")
    }
  } catch (err) {
    res.send(`Error: ${err.message}`).status(500)
    console.error(err)
  }
})

app.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/#logout-success")
})

export default app
