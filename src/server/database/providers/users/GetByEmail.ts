import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IUser } from "../../models";


export const getByEmail = async (email: string): Promise<IUser | Error> => {

  try {
    const result = await Knex(ETableNames.user)
      .select('*')
      .where('email', '=', email) // This will return an array of 1 user
      .first() // That is why is pick up the first, so it return the object (IUser), not the array with this user.

    if (result) return result
    return new Error('Registro não encontrado');
  } catch (error) {
    console.log(error)
    return new Error('Error ao coletar o registro')
  }
}