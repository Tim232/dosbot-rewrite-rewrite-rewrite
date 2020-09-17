import Knex from "knex";

global.db = require('knex')(require('../../../config.json').database)

declare global {
    namespace NodeJS {
        interface Global {
            db: Knex
        }
    }
}
