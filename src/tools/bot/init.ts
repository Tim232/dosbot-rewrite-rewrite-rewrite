import {Client} from "discord.js";

export default (client: Client) => {
    const config = require('../../../config.json')

    client.on('ready', () => {
        if (!client.shard) {
            console.error('Shard only')
            process.exit(0)
        }

        console.log(`======================
TAG: ${client.user!.tag}
ID: ${client.user!.id}
======================`)
    })

    client.login(config.bot.token)
}