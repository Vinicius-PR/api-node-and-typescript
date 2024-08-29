import { Router } from "express";

import { StatusCodes } from "http-status-codes"

const router = Router()

router.get('/', (req, res) => {
  return res.status(StatusCodes.ACCEPTED).send("Ola Dev")
})

export { router }