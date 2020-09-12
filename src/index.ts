import {ShardingManager} from 'discord.js'
import path from "path";

(async () => {
    const config = require('../config.json')
    const manager = new ShardingManager(path.join(__dirname, 'bot.ts'), {
        execArgv: ['-r', 'ts-node/register'],
        token: config.bot.token,
        totalShards: config.bot.shard.total,
        respawn: true
    })

    manager.on('shardCreate', shard => console.log(`Launched shard #${shard.id}`))

    await manager.spawn()

    console.log('spawn complete')
})()
