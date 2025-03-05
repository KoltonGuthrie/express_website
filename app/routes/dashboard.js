import express from "express";
import { getCredentialsByUsername } from '../database/credentials.js'
import { getUserRoleById } from '../database/roles.js'
import { getUserById } from '../database/user.js'
const router = express.Router();

router.use(async (req, res, next) => {
    const username = req.session.username;
    if(!username) return res.send("Internal server error").status(500);

    const data = {};

    const creds = await getCredentialsByUsername(username);
    if(!creds?.user_id) return res.send("Internal server error").status(500);
    data.username = creds.username;
    data.displayname = creds.displayname;

    const user = await getUserById(creds.user_id);
    data.email = user.email;

    const role = await getUserRoleById(creds.user_id);
    data.role = role.name;

    res.locals.currentUser = data;

    next();
});

router.get("/", (req, res) => {
  res.redirect("dashboard/users");
});

router.get("/users", (req, res) => {
  res.render("dashboard/users", {
    layout: "dashboard/layout",
    users: [{ id: 1, username: "test" }],
  });
});

router.get("/settings", (req, res) => {
  res.render("dashboard/settings", {
    layout: "dashboard/layout",
  });
});

router.get("/reports", (req, res) => {
  res.render("dashboard/reports", {
    layout: "dashboard/layout",
  });
});

router.get("/profile", (req, res) => {
  res.render("dashboard/profile", {
    layout: "dashboard/layout",
  });
});

export default router;
