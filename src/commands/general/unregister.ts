import { Command } from "..";
import { createMessageEmbed } from "../../tools/interface/embed";

export const unregister: Command = {
  name: "탈퇴",
  aliases: [],
  permission: "general",
  async run(client, msg) {
    const embed = msg.embed();
    embed.setTitle("다스봇 서비스 탈퇴");
    embed.setDescription(
      "다스봇 서비스를 탈퇴하시려면 :o:를 눌려주세요.\n탈퇴하면 해당 유저의 모든 정보가 삭제됩니다..\n30초동안 반응이 없을 시 취소됩니다."
    );
    const m = await msg.channel.send(embed);
    await m.react("⭕");
    await m.react("❌");
    let collector = m.createReactionCollector(
      (reaction, user) =>
        ["⭕", "❌"].includes(reaction.emoji.name) && user.id === msg.author.id,
      {
        time: 30000,
        max: 1,
      }
    );

    collector.on("collect", (reaction) => {
      if (reaction.emoji.name === "❌") return collector.stop("cancel");
      if (reaction.emoji.name === "⭕") return collector.stop("confirmed");
    });

    collector.on("end", async (_, reason) => {
      await m.delete();
      if (["time", "cancel"].includes(reason)) {
        await msg.channel.send(createMessageEmbed("취소되었습니다."));
      }
      if (reason === "confirmed") {
        await global.db("users").where('id', msg.author.id).delete();
        await msg.channel.send(createMessageEmbed("탈퇴가 완료되었습니다.", "GREEN"));
      }
    });
  },
};
