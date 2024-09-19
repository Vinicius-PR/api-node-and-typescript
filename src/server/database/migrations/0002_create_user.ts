import { Knex } from "knex";
import { ETableNames } from "../ETableNames";


export async function up(knex: Knex): Promise<void> {
  return knex
    .schema
    .createTable(ETableNames.user, table => {
      table.bigIncrements('id').primary().index()
      table.string('name').notNullable().checkLength('>', 3)
      table.string('senha').notNullable().checkLength('>', 6)
      table.string('email').index().unique().notNullable().checkLength('>', 5)

      table.comment('Table used to save user information in the system')
    })
    .then(() => {
      console.log(`Create table ${ETableNames.user}`)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex
    .schema
    .dropTable(ETableNames.user)
    .then(() => {
      console.log(`Dropped table ${ETableNames.user}`)
    })
}

