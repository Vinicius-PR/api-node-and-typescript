import * as create from './Create'
import * as getById from './GetById'
import * as getAll from './GetAll'
import * as deleteById from './DeleteById'
import * as updateById from './UpdateById'
import * as count from './Count'

export const PersonProviders = {
  ...create,
  ...getById,
  ...getAll,
  ...deleteById,
  ...updateById,
  ...count
}