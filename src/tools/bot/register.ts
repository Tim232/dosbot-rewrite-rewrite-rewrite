import { Message } from "discord.js";
import { createMessageEmbed } from "../interface/embed";

export default async (msg: Message) => {
    const embed = msg.embed()
    embed.setTitle('다스봇 서비스 가입')
    embed.setDescription('다스봇 서비스에 가입하시려면 :o:를 눌려주세요.\n가입하면 다스봇 데이터베이스에 정보가 저장됩니다.\n{접두사}탈퇴 를 입력해 탈퇴 할 수 있습니다.\n30초동안 반응이 없을 시 취소됩니다.')
    const m = await msg.channel.send(embed)
    await m.react('⭕')
    await m.react('❌')
    let collector = m.createReactionCollector((reaction , user) => ['⭕', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id, {
        time: 30000,
        max: 1
    })

    collector.on('collect', (reaction) => {
        if (reaction.emoji.name === '❌') return collector.stop('cancel')
        if (reaction.emoji.name === '⭕') return collector.stop('confirmed')
    })

    collector.on('end',  async (_, reason) => {
        await m.delete()
        if (['time', 'cancel'].includes(reason)) {
            await msg.channel.send(createMessageEmbed('취소되었습니다.'))
        }
        if (reason === 'confirmed') {
            await global.db('users').insert({
                id: msg.author.id
            })
            await msg.channel.send(createMessageEmbed('가입되었습니다.', 'GREEN'))
        }
    })
}