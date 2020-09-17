import { BitFieldResolvable } from "discord.js";
import {Client, Message} from "discord.js";

export type Command = {
    name: string
    aliases: Array<string>
    permission: string
    run(client: Client, msg: Message, lang: any): Promise<any>
}

type Permission = {
    permissions?: BitFieldResolvable<PermissionName>,
    ids?: Array<string>
}

export type FullCommand = Command & {
    category: string
    perm: Permission
}

const commands: any = {}

commands.general = require('./general')
commands.economy = require('./economy')
commands.dev = require('./dev')

Object.keys(commands).forEach(c => {
    const category = c

    // @ts-ignore
    Object.values(commands[c]).forEach((command: FullCommand) => {
        command.perm = require('../permissions').default[command.permission]
        command.category = category
        module.exports[command.name] = command;

        command.aliases.forEach(alias => module.exports[alias] = command)
    })
})
