import {Message} from "discord.js";
import {FullCommand} from '../../commands'
import { createMessageEmbed } from "../interface/embed";

declare module 'discord.js' {
    interface Message {
        args: Array<string>
    }
}

export default async (msg: Message) => {
    const prefix = '..'
    if (msg.author.bot || !msg.content.startsWith(prefix)) return
    if (!msg.guild) {
        return msg.channel.send(createMessageEmbed('다스봇은 DM에서 사용 불가능해요!'))
    }

    if (!(await global.db('users').where('id', msg.author.id).limit(1))[0]) {
        await require('./register').default(msg)
    }

    const args = msg.content.slice(prefix.length).split(/ +/g)
    const command = args.shift()!
    const commands = require('../../commands')

    const cmd: FullCommand = commands[command]

    if (!cmd) return

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