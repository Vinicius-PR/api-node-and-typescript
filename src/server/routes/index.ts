import { Router } from "express";

import { StatusCodes } from "http-status-codes"
import { CityControllers } from '../controllers'



const router = Router()

router.get('/', (req, res) => {
  console.log('we are at / end point')
  return res.status(StatusCodes.ACCEPTED).send("Ola Dev")
})


router.post('/city', CityControllers.createBodyValidator, CityControllers.create)


export { router }