import knex from "knex";
import { development, production, test } from './Environment'

const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case 'prodction':
      return production

    case 'test':
      return test

    default:
      return development;
  }
}

export const Knex = knex(getEnvironment())