import { Knex } from "knex";
import { ETableNames } from "../ETableNames";


export async function up(knex: Knex): Promise<void> {
  return knex
    .schema
    .createTable(ETableNames.city, table => {
      table.bigIncrements('id').primary().index()
      table.string('name', 150).checkLength("<=", 150).index().notNullable()

      table.comment('Table used to save city name in the system')
    })
    .then(() => {
      console.log(`Create table ${ETableNames.city}`)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex
    .schema
    .dropTable(ETableNames.city)
    .then(() => {
      console.log(`Dropped table ${ETableNames.city}`)
    })
}

