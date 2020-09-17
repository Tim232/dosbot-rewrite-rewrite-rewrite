import { MessageEmbed } from "discord.js";
import { ColorResolvable } from "discord.js";

export function createMessageEmbed(msg?: string, color?: ColorResolvable) : MessageEmbed {
    return new MessageEmbed().setDescription(msg).setColor(color || 'RED')
}