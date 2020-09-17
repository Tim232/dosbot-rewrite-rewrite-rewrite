import {Message, User, Guild} from "discord.js";
import {FullCommand} from '../../commands'
import { createMessageEmbed } from "../interface/embed";

declare module 'discord.js' {
    interface Guild {
        getConfig(key: string) : Promise<any | null>
        setConfig(key: string, val: string) : Promise<boolean>
    }

    interface User {
        getConfig(key: string) : Promise<any | null>
        setConfig(key: string, val: any) : Promise<boolean>
    }
}

declare module 'discord.js' {
    interface Message {
        args: Array<string>
    }
}

User.prototype.getConfig = async function(key) {
    const user = (await global.db('users').where('id', this.id))[0]
    return user[key] === undefined ? null : user[key]
}

User.prototype.setConfig = async function(key, val) {
    const user = (await global.db('users').where('id', this.id))[0]
    user[key] = val
    await global.db('users').where('id', this.id).update(user)
    return true
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

export default async (msg: Message) => {
    const prefix = '..'
    if (msg.author.bot || !msg.content.startsWith(prefix)) return
    if (!msg.guild) {
        return
    }

    const args = msg.content.slice(prefix.length).split(/ +/g)
    const command = args.shift()!
    const commands = require('../../commands')

    const cmd: FullCommand = commands[command]

    if (!cmd) return

    if (!(await global.db('users').where('id', msg.author.id).limit(1))[0]) {
        return require('./register').default(msg)
    }

    console.log(`[${msg.author.tag}] ${msg.content}`)

    msg.args = args

    if (cmd.perm) {
        // @ts-ignore
        if (cmd.perm.permissions && !msg.member!.hasPermission(cmd.perm.permissions!)) {
            return msg.channel.send(createMessageEmbed('이 명령여를 사용하기 위해 필요한 권한이 없어요!' + ' ```diff\n' + '-' + cmd.permission + '\n' + (
                // @ts-ignore
                cmd.perm.permissions.map((perm: PermissionName) => msg.member!.hasPermission(perm) ? '+' + perm : '-' + perm)
            ) + '```'))
        }

        if (cmd.perm.ids && !cmd.perm.ids.includes(msg.author.id)) {
            return msg.channel.send(createMessageEmbed('이 명령어를 사용하기 위해 필요한 권한이 없어요! \n ```diff\n-' + cmd.permission + '```'))
        }
    }

    try {
        await cmd.run(msg.client, msg, null)
    } catch(e) {
        return msg.channel.send(
            createMessageEmbed(
                '```js\n' + e.message + '```'
            )
        )
    }
}