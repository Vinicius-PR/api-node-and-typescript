/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from "express"
import * as yup from 'yup'

interface CityProps {
  name: string
}

const bodyRequestValidation: yup.Schema<CityProps> = yup.object().shape({
  name: yup.string().required().min(3)
})

export const create = async (req: Request<{}, {}, CityProps>, res: Response) => {
  let validatedData: CityProps | undefined = undefined

  try {
    validatedData = await bodyRequestValidation.validate(req.body)
  } catch (error) {
    const yupError = error as yup.ValidationError

    res.json({
      errors: {
        default: yupError.message
      }
    })
  }

  console.log(validatedData)

  return res.send("Created!")


}