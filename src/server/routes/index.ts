import { Router } from "express";

import { StatusCodes } from "http-status-codes"
import { CityControllers, PeopleControllers, UserControllers } from '../controllers'

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

router.get('/people', PeopleControllers.getAllValidation, PeopleControllers.getAll)
router.get('/people/:id', PeopleControllers.getByIdValidation, PeopleControllers.getById)
router.put('/people/:id', PeopleControllers.updateByIdValidation, PeopleControllers.updateById)
router.post('/people', PeopleControllers.createValidation, PeopleControllers.create)
router.delete('/people/:id', PeopleControllers.deleteByIdValidation, PeopleControllers.deleteById)

router.post('/entrar', UserControllers.signInValidation, UserControllers.signIn)
router.post('/cadastrar', UserControllers.signUpValidation, UserControllers.signUp)

export { router }