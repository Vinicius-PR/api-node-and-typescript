import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { ICity } from "../../models";


export const getById = async (id: number): Promise<ICity | Error> => {

  try {
    const result = await Knex(ETableNames.city)
      .select('*')
      .where('id', '=', id) // This will return an array of 1 city
      .first() // That is why is pick up the first, so it return the object (ICity), not the array with this city.

    if (result) return result
    return new Error('Registro não encontrado');
  } catch (error) {
    console.log(error)
    return new Error('Error ao coletar o registro')
  }
}