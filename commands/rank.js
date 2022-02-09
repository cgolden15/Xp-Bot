const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");
const userSchema = require('../schemas/userSchema')

module.exports.run = async (client, message, args) => {
  const result = await userSchema.findOne({
    userId: message.author.id
  });

  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  let level = result.level || 1
  let exp = result.xp || 0
  let neededXP = level*200
  let background = "https://www.worldatlas.com/r/w768/upload/1c/2b/66/shutterstock-149198729-2.jpg"

  const card = new canvacord.Rank()
    .setUsername(user.username)
    .setDiscriminator(user.discriminator)
    .setLevel(level)
    .setCurrentXP(exp)
    .setRequiredXP(neededXP)
    .setStatus(user.presence.status)
    .setBackground("IMAGE", background)
    .setAvatar(user.displayAvatarURL({ format: "png", size: 1024 }));

  const img = await card.build();

  return message.channel.send(new MessageAttachment(img, "rank.png"));
};

module.exports.help = {
  name: "rank"
};