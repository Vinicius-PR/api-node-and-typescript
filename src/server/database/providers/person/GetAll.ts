import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IPerson } from "../../models";

export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<IPerson[] | Error> => {

  try {
    const result = await Knex(ETableNames.person)
      .select('*')
      .where('id', Number(id))
      .orWhere('name', 'like', `%${filter}%`)
      .offset((page - 1) * limit)
      .limit(limit)

    return result
  } catch (error) {
    console.log(error)
    return new Error('Erro ao coletar todos os dados de pessoas')
  }
}