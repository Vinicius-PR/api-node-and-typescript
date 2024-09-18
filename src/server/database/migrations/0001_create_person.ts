import { Knex } from "knex";
import { ETableNames } from "../ETableNames";


export async function up(knex: Knex): Promise<void> {
  return knex
    .schema
    .createTable(ETableNames.person, table => {
      table.bigIncrements('id').primary().index()
      table.string('name').index().notNullable()
      table.string('email').unique().notNullable()
      table.bigInteger('cityId')
        .index()
        .notNullable()
        .references('id')
        .inTable(ETableNames.city)
        .onUpdate('CASCADE') // If change the id of the city, here the id will be changed too.
        .onDelete('RESTRICT') // This avoid deleting the city if there is a person connect to the referenced city

      table.comment('Table used to save person name in the system')
    })
    .then(() => {
      console.log(`Create table ${ETableNames.person}`)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex
    .schema
    .dropTable(ETableNames.person)
    .then(() => {
      console.log(`Dropped table ${ETableNames.person}`)
    })
}

