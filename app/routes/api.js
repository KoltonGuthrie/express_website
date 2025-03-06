import { apiLoginRequired, apiAdminRequired } from "./utils.js"
import { updateSettings } from "../database/settings.js"
import { getCredentialsByUsername } from "../database/credentials.js"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import express from "express"
import { getAllUserDetails, getUserDetails } from "../database/user.js"

const router = express.Router()

// Because some api routes may not require login later,
// they will be set here instead of within the app
router.use("/user", apiLoginRequired, apiAdminRequired)
router.use("/settings", apiLoginRequired, apiAdminRequired)

router.get("/", (req, res) => {
  res.send("[GET, PUT] /user and [POST] /settings")
})

router.put("/user", async (req, res) => {
  try {
    const id = req.params.id

    if (!id) {
      result.message = ReasonPhrases.BAD_REQUEST
      return res.send(result).status(StatusCodes.BAD_REQUEST)
    }

    const result = {
      success: false,
      data: undefined,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR
    }

    result.message = ReasonPhrases.NOT_IMPLEMENTED
    result.success = true
    result.status = StatusCodes.NOT_IMPLEMENTED

    res.send(result).status(StatusCodes.NOT_IMPLEMENTED)
  } catch (err) {
    res.send(result).status(StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

router.get("/user", async (req, res) => {
  try {
    const result = {
      success: false,
      data: undefined,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR
    }

    const data = await getAllUserDetails()

    if (data) result.data = { columns: data.columns, users: data.rows }

    result.message = `Returned ${data?.rows?.length || 0} user(s)`
    result.success = true
    result.status = StatusCodes.OK

    res.send(result).status(StatusCodes.OK)
  } catch (err) {
    res.send(result).status(StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

router.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id

    if (!id) {
      result.message = ReasonPhrases.BAD_REQUEST
      return res.send(result).status(StatusCodes.BAD_REQUEST)
    }

    const result = {
      success: false,
      data: undefined,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR
    }

    const data = await getUserDetails(id)

    if (!data?.rows) {
      result.success = true
      result.message = `No user with id ${id}`
      result.status = StatusCodes.OK
      return res.send(result).status(StatusCodes.OK)
    }

    result.data = { columns: data.columns, users: data.rows }

    result.message = `Returned user ${id}'s data`
    result.success = true
    result.status = StatusCodes.OK

    res.send(result).status(StatusCodes.OK)
  } catch (err) {
    res.send(result).status(StatusCodes.INTERNAL_SERVER_ERROR)
  }
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
