/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Request, Response } from "express"
import * as yup from 'yup'
import "../../shared/services/TranslationsYup"
import { validation } from "../../shared/middlewares"
import { StatusCodes } from "http-status-codes"

interface CityProps {
  name: string
}

export const createValidation = validation((getSchema) => ({
  body: getSchema<CityProps>(yup.object().shape({
    name: yup.string().required().min(3)
  }))
}))

export const create = async (req: Request<{}, {}, CityProps>, res: Response) => {
  return res.status(StatusCodes.CREATED).json(1)
}