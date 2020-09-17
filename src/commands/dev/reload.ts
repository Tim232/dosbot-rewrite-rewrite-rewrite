import { Command } from "..";
import { createMessageEmbed } from "../../tools/interface/embed";

export const Reload : Command = {
    name: '리로드',
    aliases: ['rl'],
    permission: 'dev',
    async run(client, msg) {
        Object.keys(require.cache).filter(r => !r.includes('node_modules')).forEach(r => delete require.cache[r])
        await msg.channel.send(createMessageEmbed('리로드 끝', 'GREEN'))
    }
}