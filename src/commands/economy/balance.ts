import { Command } from "..";

export const balanace : Command = {
    name: '돈',
    aliases: [],
    permission: 'general',
    async run(client, msg) {
        return msg.reply(msg.embed().setDescription(`${msg.author.username}님의 지갑 ${await msg.author.getConfig('balance')} 돈(?)`))
    }
}