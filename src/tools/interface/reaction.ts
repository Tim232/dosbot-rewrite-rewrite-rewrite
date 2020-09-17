import { Client } from "discord.js";

export async function getEmoji(client: Client, id: string) : Promise<any> {
    return (await client.shard!.broadcastEval(`
            (async () => {
                const emoji = this.emojis.cache.get('${id}')
                if (emoji) {
                    return emoji
                }
            })();
        `)).filter(r => r !== null)[0]
}

export async function getEmojiString(client: Client, id: string) {
    const emoji = await getEmoji(client, id)
    return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`
}
