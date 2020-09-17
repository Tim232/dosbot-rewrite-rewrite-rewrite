import { IResolvers } from 'graphql-tools';
const resolverMap: IResolvers = {
    Query: {
        async guilds(_: void, args: void, ctx): Promise<Array<any>> {
            const guilds = ctx.user.guilds.filter((r: any) => r.permissions & 8)

            const guildList = (await global.bot.broadcastEval('this.guilds.cache.map(r => r.id)')).reduce((acc,cur) => [...acc,...cur])

            return guilds.map((guild: any) => ({...guild, bot: guildList.includes(guild.id)}))
        },
    },
};
export default resolverMap;