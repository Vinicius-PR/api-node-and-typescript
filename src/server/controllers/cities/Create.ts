/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request, Response } from "express"

interface City {
  name: string
}

export const create = (req: Request<{}, {}, City>, res: Response) => {

  return res.send("Created!")
}