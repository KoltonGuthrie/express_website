import { loginRequired, adminRequired } from "../utils.js"
import { updateSettings } from "../database/settings.js"
import { getCredentialsByUsername } from "../database/credentials.js"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import express from "express"

const router = express.Router()

// Because some api routes may not require login later,
// they will be set here instead of within the app
router.use("/user", loginRequired, adminRequired)
router.use("/settings", loginRequired, adminRequired)

router.get("/", (req, res) => {
  res.send("[GET, PUT] /user and [POST] /settings")
})

router.get("/user", (req, res) => {
  res.send("/user")
})

router.put("/user/:id", (req, res) => {
  const userId = req.params.id

  res.send(`User ID to update: ${userId}`)
})

router.post("/settings", async (req, res) => {
  const result = {
    success: false,
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    status: StatusCodes.INTERNAL_SERVER_ERROR
  }

  const userId = (await getCredentialsByUsername(req.session.username)).rows.user_id

  if (!userId) {
    result.message = ReasonPhrases.UNAUTHORIZED
    result.status = StatusCodes.UNAUTHORIZED
    res.send(result).status(StatusCodes.UNAUTHORIZED)
  }

  try {
    // Checkbox default is no response or "on"
    if (!req.body["website-settings-display-mode"]) {
      // Checkbox was not ticked. Is light-mode
      req.body["website-settings-display-mode"] = "light"
    } else {
      req.body["website-settings-display-mode"] = "dark"
    }

    const updatedSettings = await updateSettings(userId, req.body)

    result.success = true
    result.message = `Updated ${updatedSettings} setting(s) for user ${req.session.username}`
    result.status = StatusCodes.OK
    res.send(result).status(StatusCodes.OK)
  } catch (err) {
    res.send(result).status(StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

export default router
