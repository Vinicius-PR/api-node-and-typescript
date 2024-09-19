/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from "express";
import { validation } from "../../shared/middlewares";
import * as yup from 'yup'
import "../../shared/services/TranslationsYup"
import { PersonProviders } from "../../database/providers/person";
import { StatusCodes } from "http-status-codes";

interface IQueryProps {
  page?: number
  limit?: number
  filter?: string
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(yup.object().shape({
    page: yup.number().optional().moreThan(0),
    limit: yup.number().optional().moreThan(0),
    filter: yup.string().optional()
  }))
}))

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  const result = await PersonProviders.getAll(req.query.page || 1, req.query.limit || 7, req.query.filter || '');
  const count = await PersonProviders.count(req.query.filter);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message }
    });
  } else if (count instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: count.message }
    });
  }

  res.setHeader('access-control-expose-headers', 'x-total-count');
  res.setHeader('x-total-count', count);

  return res.status(StatusCodes.OK).json(result);
}