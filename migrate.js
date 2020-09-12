const knex = require('knex')(require('./config.json').database)

switch (process.argv[2]) {
    case 'delete':
        (async () => {
            await knex.schema.dropTableIfExists('guilds')
            await knex.schema.dropTableIfExists('users')
            await knex.destroy()
        })()
        console.log('success')
        break
    case 'migrate':
        (async () => {
            await knex.schema.createTable('guilds', function (table) {
                table.text('id').notNullable()
                table.text('lang').notNullable()
                table.json('config').notNullable()
            })
            await knex.schema.createTable('users', function (table) {
                table.text('id').notNullable()
                table.bigInteger('balance').notNullable().defaultTo(0)
            })
            console.log('complete')
            await knex.destroy()
        })()
        break
    default:
        console.log('node migrate <migrate/delete>')
        knex.destroy()
}
