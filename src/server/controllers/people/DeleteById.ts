import { Request, Response } from "express";
import * as yup from 'yup'
import "../../shared/services/TranslationsYup"
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { PersonProviders } from "../../database/providers/person";

interface IParamsProps {
  id?: number
}

export const deleteByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamsProps>(yup.object().shape({
    id: yup.number().integer().required().moreThan(0)
  }))
}))

export const deleteById = async (req: Request<IParamsProps>, res: Response) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      erros: {
        default: "O parametro id precisa ser informado"
      }
    })
  }

  const result = await PersonProviders.deleteById(req.params.id)

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  }

  return res.status(StatusCodes.NO_CONTENT).send()
}