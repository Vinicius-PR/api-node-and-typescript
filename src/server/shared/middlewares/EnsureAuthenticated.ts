import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { JWTService } from "../services"

export const ensureAuthenticated: RequestHandler = (req, res, next) => {

  const { authorization } = req.headers

  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: "Não autenticado" }
    })
  }

  const [type, token] = authorization.split(' ')

  if (type !== "Bearer") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: "Não autenticado" }
    })
  }

  const jwtData = JWTService.verify(token)
  if (jwtData === "JWT_SECRET_NOT_FOUND") {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: "Error ao verificar o token" }
    })
  } else if (jwtData === "INVALID_TOKEN") {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: { default: "Não autenticado" }
    })
  }

  console.log(jwtData)
  req.headers.idUser = jwtData.uid.toString()

  return next()
}