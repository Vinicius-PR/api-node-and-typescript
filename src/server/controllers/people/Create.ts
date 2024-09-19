/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Request, Response } from "express"
import * as yup from 'yup'
import "../../shared/services/TranslationsYup"
import { validation } from "../../shared/middlewares"
import { StatusCodes } from "http-status-codes"
import { IPerson } from "../../database/models"
import { PersonProviders } from "../../database/providers/person"

interface IBodyProps extends Omit<IPerson, 'id'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    name: yup.string().required().min(3),
    email: yup.string().required().email(),
    cityId: yup.number().integer().required().min(1)
  }))
}))

export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const result = await PersonProviders.create(req.body)

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  }

  return res.status(StatusCodes.CREATED).json(result)
}