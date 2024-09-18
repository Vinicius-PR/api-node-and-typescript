import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IPerson } from "../../models";

export const getById = async (id: number): Promise<IPerson | Error> => {
  try {
    const result = await Knex(ETableNames.person)
      .select('*')
      .where('id', '=', id)
      .first()

    if (result) return result

    return new Error('Registro não encontrado')
  } catch (error) {
    console.log(error)
    return new Error('Error ao acessar o registro de pessoas')
  }
}