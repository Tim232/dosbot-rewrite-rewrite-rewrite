import { MessageEmbed } from "discord.js";
import {Client, Message} from "discord.js";
import init from "./tools/bot/init";
import './tools/database'
import { createMessageEmbed } from "./tools/interface/embed";

declare module 'discord.js' {
    interface Message {
        embed() : MessageEmbed
    }
}

Message.prototype.embed = function() {
    const embed = createMessageEmbed('', 'BLUE')
    embed.setFooter(this.author.tag, this.author.avatarURL({dynamic: true})!)
    embed.setTimestamp(Date.now())
    return embed
}

const client = new Client()

init(client)
