import { ETableNames } from "../../ETableNames"
import { Knex } from "../../knex"
import { IPerson } from "../../models"

export const create = async (person: Omit<IPerson, 'id'>): Promise<number | Error> => {
  try {
    const [{ count }] = await Knex(ETableNames.person)
      .where('id', '=', person.cityId)
      .count<[{ count: number }]>('* as count')

    if (count === 0) {
      return new Error("The city used during register was not found")
    }

    const [result] = await Knex(ETableNames.person).insert(person).returning('id')

    if (typeof result === 'object') {
      return result.id
    } else if (typeof result === 'number') {
      return result
    }

    return new Error('Erro ao criar uma pessoa')
  } catch (error) {
    console.log(error)
    return new Error('Erro ao cria uma pessoa')
  }
}