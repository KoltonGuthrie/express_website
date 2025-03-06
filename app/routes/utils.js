import { ReasonPhrases, StatusCodes } from "http-status-codes"

function apiLoginRequired(req, res, next) {
  const result = {
    success: false,
    data: undefined,
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    status: StatusCodes.INTERNAL_SERVER_ERROR
  }

  if (req.session && req.session.username) return next()

  result.message = ReasonPhrases.UNAUTHORIZED
  result.status = StatusCodes.UNAUTHORIZED
  res.send(result).status(StatusCodes.UNAUTHORIZED)
}

function apiAdminRequired(req, res, next) {
  const result = {
    success: false,
    data: undefined,
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    status: StatusCodes.INTERNAL_SERVER_ERROR
  }

  if (req.session && req.session.username && req.session.role === "admin") return next()

  result.message = ReasonPhrases.UNAUTHORIZED
  result.status = StatusCodes.UNAUTHORIZED
  res.send(result).status(StatusCodes.UNAUTHORIZED)
}

export { apiLoginRequired, apiAdminRequired }
