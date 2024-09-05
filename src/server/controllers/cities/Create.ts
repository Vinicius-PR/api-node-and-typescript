/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, RequestHandler, Response } from "express"
import { StatusCodes } from "http-status-codes"
import * as yup from 'yup'
import "../../shared/services/TranslationsYup"

interface CityProps {
  name: string
  estado: string
}

const bodyRequestValidation: yup.Schema<CityProps> = yup.object().shape({
  name: yup.string().required().min(3),
  estado: yup.string().required().min(2)
})

export const createBodyValidator: RequestHandler = async (req, res, next) => {
  try {
    await bodyRequestValidation.validate(req.body, { abortEarly: false })
    return next()
  } catch (err) {
    const yupError = err as yup.ValidationError
    const errors: Record<string, string> = {}

    yupError.inner.forEach(error => {
      if (error.path === undefined) return

      errors[error.path] = error.message
    })

    return res.status(StatusCodes.BAD_REQUEST).json({ errors })
  }
}


export const create = async (req: Request<{}, {}, CityProps>, res: Response) => {


  console.log(req.body)

  return res.send("Created!")
}