/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from "express"
import * as yup from 'yup'
import "../../shared/services/TranslationsYup"
import { validation } from "../../shared/middlewares"
import { StatusCodes } from "http-status-codes"
import { IPerson } from "../../database/models"
import { PersonProviders } from "../../database/providers/person"

interface IParamsProps {
  id?: number
}

interface IBodyProps extends Omit<IPerson, 'id'> { }

export const updateByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamsProps>(yup.object().shape({
    id: yup.number().integer().required().moreThan(0)
  })),
  body: getSchema<IBodyProps>(yup.object().shape({
    name: yup.string().required().min(3),
    email: yup.string().required().email(),
    cityId: yup.number().integer().required().min(1)
  }))
}))

export const updateById = async (req: Request<IParamsProps, {}, IBodyProps>, res: Response) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: "O parâmetro id precisa ser informado"
      }
    })
  }

  const result = await PersonProviders.updateById(req.params.id, req.body)

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  }

  return res.status(StatusCodes.NO_CONTENT).json(result)
}