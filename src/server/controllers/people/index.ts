import * as create from '../people/Create'
import * as getAll from '../people/GetAll'
import * as getById from '../people/GetById'
import * as updateById from '../people/UpdateById'
import * as deleteById from '../people/DeleteById'

export const PeopleControllers = {
  ...create,
  ...getAll,
  ...getById,
  ...updateById,
  ...deleteById
}
