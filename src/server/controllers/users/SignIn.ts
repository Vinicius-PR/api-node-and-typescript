/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from "express";
import * as yup from 'yup'
import "../../shared/services/TranslationsYup"
import { StatusCodes } from "http-status-codes";
import { validation } from "../../shared/middlewares";
import { UsersProviders } from "../../database/providers/users";
import { IUser } from "../../database/models";


interface IBodyProps extends Omit<IUser, 'id' | 'name'> { }

export const signInValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    email: yup.string().required().email().min(5),
    password: yup.string().required().min(6)
  }))
}))

export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const result = await UsersProviders.getByEmail(req.body.email)

  if (result instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: "Email ou senha são inválidos"
      }
    })
  }

  if (result.password !== req.body.password) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: "Email ou senha são inválidos"
      }
    })
  }


  return res.status(StatusCodes.OK).json({ accessToken: 'teste.teste.teste' })
}