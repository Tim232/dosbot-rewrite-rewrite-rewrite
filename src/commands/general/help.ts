import {Command} from "../index";
import {Client, Message} from "discord.js";
import * as commands from '..'

export const helpCommand : Command = {
    name: '도움말',
    aliases: ['도움', 'help'],
    permission: 'general',
    async run(client: Client, msg: Message): Promise<any> {
        const categories = Array.from(new Set(Object.values(commands).map((command: any) => command.category)))
        const embed = msg.embed()
        categories.forEach(category => {
            // @ts-ignore
            embed.addField(category, '`' + Object.keys(commands).filter((r: any) => commands[r].category === category && !commands[r].aliases.includes(r)).map((r: any) => r).join('` `') + '`')
        })
        embed.setFooter(`${msg.author.tag} | 개발자: 파랑이#0001`, msg.author.avatarURL({dynamic: true})!)
        msg.channel.send(embed)
    }
}
