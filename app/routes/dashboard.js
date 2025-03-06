import express from "express"
import { getCredentialsByUsername } from "../database/credentials.js"
import { getUserRoleById } from "../database/roles.js"
import { getUserById, getAllUserDetails } from "../database/user.js"
const router = express.Router()

router.use(async (req, res, next) => {
  const username = req.session.username
  if (!username) return res.send("Internal server error").status(500)

  const data = {}

  const creds = (await getCredentialsByUsername(username)).rows
  if (!creds?.user_id) return res.send("Internal server error").status(500)
  data.username = creds.username
  data.displayname = creds.displayname

  const user = (await getUserById(creds.user_id)).rows
  data.email = user.email

  const role = (await getUserRoleById(creds.user_id)).rows
  data.role = role.name

  res.locals.currentUser = data

  res.locals.settings = req.session.settings

  // Use dashboard/layout for all pages in this route
  res.locals.layout = "dashboard/layout"

  next()
})

router.get("/", (req, res) => {
  res.redirect("dashboard/users")
})

router.get("/users", async (req, res) => {
  const users = await getAllUserDetails()

  res.render("dashboard/users", {
    users: users.rows,
    columns: users.columns
  })
})

router.get("/settings", (req, res) => {
  res.render("dashboard/settings")
})

router.get("/reports", (req, res) => {
  res.render("dashboard/reports")
})

router.get("/profile", (req, res) => {
  res.render("dashboard/profile")
})

export default router
