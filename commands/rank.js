const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");
const userSchema = require('../schemas/userSchema')

module.exports.run = async (client, message, args) => {
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  let result = await userSchema.find({ }).sort({ xp: -1 });
  let rank = result.map(result => result.userId).indexOf(user.id) + 1 || "N/A";
  result = await userSchema.findOne({
    userId: user.id,
  })

  let level = result.level || 1
  let exp = result.xp || 0
  let neededXP = level*200
  let background = "https://www.worldatlas.com/r/w768/upload/1c/2b/66/shutterstock-149198729-2.jpg"
  const card = new canvacord.Rank()
    .setUsername(user.username)
    .setDiscriminator(user.discriminator)
    .setLevel(level)
    .setRank(rank)
    .setCurrentXP(exp)
    .setRequiredXP(neededXP)
    .setBackground("IMAGE", background)
    .setAvatar(user.displayAvatarURL({ format: "png", size: 1024 }));

  const img = await card.build();

  const attachment = new MessageAttachment(img, 'rank.png')
  return message.channel.send({ files: [new MessageAttachment(img, 'rank.png')] });
};

module.exports.help = {
  name: "rank"
};