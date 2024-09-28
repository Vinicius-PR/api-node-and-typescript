/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from "express";
import * as yup from 'yup'
import "../../shared/services/TranslationsYup"
import { StatusCodes } from "http-status-codes";
import { validation } from "../../shared/middlewares";
import { UsersProviders } from "../../database/providers/users";
import { IUser } from "../../database/models";
import { JWTService, PasswordCryto } from "../../shared/services";


interface IBodyProps extends Omit<IUser, 'id' | 'name'> { }

export const signInValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    email: yup.string().required().email().min(5),
    password: yup.string().required().min(6)
  }))
}))

export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const user = await UsersProviders.getByEmail(req.body.email)

  if (user instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: "Email ou senha são inválidos"
      }
    })
  }

  const resultPassword = await PasswordCryto.verifyPassword(req.body.password, user.password)
  if (!resultPassword) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: "Email ou senha são inválidos"
      }
    })
  } else {
    const accessToken = JWTService.signIn({ uid: user.id })
    if (accessToken === "JWT_SECRET_NOT_FOUND") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: "Error ao gerar o token de acesso"
        }
      })
    }

    return res.status(StatusCodes.OK).json({ accessToken })
  }
}