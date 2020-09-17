import {ShardingManager} from 'discord.js'
import path from "path";
import chokidar from 'chokidar'
import './tools/database'

(async () => {
    const config = require('../config.json')
    const manager = new ShardingManager(path.join(__dirname, 'bot.ts'), {
        execArgv: ['-r', 'ts-node/register'],
        token: config.bot.token,
        totalShards: config.bot.shard.total,
        respawn: true
    })

    global.bot = manager

    manager.on('shardCreate', shard => console.log(`Launched shard #${shard.id}`))

    await manager.spawn()

    const guilds = (await manager.broadcastEval('this.guilds.cache.map(r => r.id)')).reduce((acc,cur) => [...acc,...cur])

    const guildList = (await global.db('guilds').select('id')).map(r => r.id)

    for (const guild of guildList) {
        if (!guilds.includes(guild)) {
            console.log(`DELETE GUILD: ${guild}`)
            await global.db('guilds').where('id', guild).delete()
        }
    }

    let api = require('./api')

    let app = api.default

    let server = app.listen(config.port)

    let apollo = api.server

    chokidar.watch(path.join(__dirname, 'api')).on('all', (eventName, path1) => {
        if (eventName === 'add') return
        if (eventName === 'addDir') return
        Object.keys(require.cache).filter(r => !r.includes('node_modules')).forEach(i => delete require.cache[i])
        console.log(`Restarting server...`)
        apollo.stop()
        server.close(() => console.log('stopped server.'))
        api = require('./api')
        app = api.default

        apollo = api.server
        server = app.listen(config.port)
        console.log('restarted server.')
    })
})()

declare global {
    namespace NodeJS {
        interface Global {
            bot: ShardingManager
        }
    }
}
