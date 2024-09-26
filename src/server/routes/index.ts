import { Router } from "express";

import { StatusCodes } from "http-status-codes"
import { CityControllers, PeopleControllers, UserControllers } from '../controllers'
import { ensureAuthenticated } from "../shared/middlewares";

const router = Router()

router.get('/', (req, res) => {
  console.log('we are at / end point')
  return res.status(StatusCodes.ACCEPTED).send("Ola Dev")
})
router.get('/city', ensureAuthenticated, CityControllers.getAllValidation, CityControllers.getAll)
router.get('/city/:id', ensureAuthenticated, CityControllers.getByIdValidation, CityControllers.getById)
router.put('/city/:id', ensureAuthenticated, CityControllers.updateByIdValidation, CityControllers.updateById)
router.post('/city', ensureAuthenticated, CityControllers.createValidation, CityControllers.create)
router.delete('/city/:id', ensureAuthenticated, CityControllers.deleteByIdValidation, CityControllers.deleteById)

router.get('/people', ensureAuthenticated, PeopleControllers.getAllValidation, PeopleControllers.getAll)
router.get('/people/:id', ensureAuthenticated, PeopleControllers.getByIdValidation, PeopleControllers.getById)
router.put('/people/:id', ensureAuthenticated, PeopleControllers.updateByIdValidation, PeopleControllers.updateById)
router.post('/people', ensureAuthenticated, PeopleControllers.createValidation, PeopleControllers.create)
router.delete('/people/:id', ensureAuthenticated, PeopleControllers.deleteByIdValidation, PeopleControllers.deleteById)

router.post('/entrar', UserControllers.signInValidation, UserControllers.signIn)
router.post('/cadastrar', UserControllers.signUpValidation, UserControllers.signUp)

export { router }