import { Router } from "express";

import { StatusCodes } from "http-status-codes"
import { CityControllers } from '../controllers'

const router = Router()

router.get('/', (req, res) => {
  console.log('we are at / end point')
  return res.status(StatusCodes.ACCEPTED).send("Ola Dev")
})
router.get('/city', CityControllers.getAllValidation, CityControllers.getAll)
router.get('/city/:id', CityControllers.getByIdValidation, CityControllers.getById)
router.put('/city/:id', CityControllers.updateByIdValidation, CityControllers.updateById)
router.post('/city', CityControllers.createValidation, CityControllers.create)
router.delete('/city/:id', CityControllers.deleteByIdValidation, CityControllers.deleteById)


export { router }