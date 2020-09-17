import {Command} from "../index";
import {Client, Message} from "discord.js";
import emojis from '../../tools/interface/emojis'
import { getEmojiString } from "../../tools/interface/reaction";

export const Eval : Command = {
    name: 'eval',
    aliases: ['script'],
    permission: 'dev',
    async run(client: Client, msg: Message): Promise<any> {
        const m = await msg.channel.send(await getEmojiString(client, emojis.loading))
        const input = await msg.args.join(' ').replace(/^```(js)?/, '').replace(/```$/, '')
        await m.edit(await new Promise(resolve => resolve(eval(input))).then(res => {
            const re = require('util').inspect(res).split('\n').map((r: string) => '> ' + r).join('\n')
            return '> ```js\n' + (re.length > 1900 ? re.slice(0,1900) + '...' : re) + '```'
        }).catch(e => {
            const re = e.stack.split('\n').join('\n> ')
            return '```js\n' + (re.length > 1900 ? re.slice(0,1900) + '...' : re) + '```'
        }))
        await m.react('🗑')
        const collector = m.createReactionCollector((reaction, user) => reaction.emoji.name === '🗑' && user.id === msg.author.id, {
            time: 30000,
            max: 1
        })
        collector.on('end', (_, reason) => {
            if (reason === 'time') return
            m.delete()
        })
    }
}
