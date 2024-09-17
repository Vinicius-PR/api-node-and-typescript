import * as create from '../cities/Create'
import * as getAll from '../cities/GetAll'
import * as getById from '../cities/GetById'
import * as updateById from '../cities/UpdateById'
import * as deleteById from '../cities/DeleteById'
import * as count from '../cities/Count'

export const CityProviders = {
  ...create,
  ...getAll,
  ...getById,
  ...updateById,
  ...deleteById,
  ...count
}
