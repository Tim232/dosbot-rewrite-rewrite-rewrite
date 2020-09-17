import {Client, Guild} from "discord.js";

declare module 'discord.js' {
    interface Guild {
        getConfig(key: string) : Promise<any | null>
        setConfig(key: string, val: string) : Promise<boolean>
    }
}

Guild.prototype.getConfig = async function(key) {
    const guild = JSON.parse((await global.db('guilds').where('id', this.id))[0].config)
    return guild[key] === undefined ? null : guild[key]
}

Guild.prototype.setConfig = async function(key, val) {
    const guild = (await global.db('guilds').where('id', this.id))[0].config
    guild[key] = val
    await global.db('guilds').where('id', this.id).update({config: JSON.stringify(guild)})
    return true
}

const deleteGuild = async (guild: Guild) => {
    console.log(`LEFT GUILD: ${guild.name}(${guild.id})`)
    await global.db('guilds').where('id', guild.id).delete()
}

const initGuild = async (guild: Guild) => {
    if (!(await global.db('guilds').select('id').where('id', guild.id))[0]) {
        console.log(`NEW GUilD: ${guild.name}(${guild.id})`)
        await global.db('guilds').insert({
            id: guild.id
        })
    }
}

export default (client: Client) => {
    const config = require('../../../config.json')

    client.on('guildCreate', async guild => {
        await initGuild(guild)
    })

    client.on('guildDelete', async guild => {
        await deleteGuild(guild)
    })

    client.on('ready', async () => {
        if (!client.shard) {
            console.error('Shard only')
            process.exit(0)
        }

        console.log(`======================
TAG: ${client.user!.tag}
ID: ${client.user!.id}
======================`)

        for (const [,guild] of client.guilds.cache) {
            await initGuild(guild)
        }
    })

    client.on('message', msg => require('./handler').default(msg))

    client.login(config.bot.token)
}