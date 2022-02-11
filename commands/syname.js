const userSchema = require('../schemas/userSchema')

module.exports.run = async (client, message, args) => {
  const devIds = ["317283391982534666", "740000222297718874"]
  if (!devIds.includes(message.author.id)) {
    return message.channel.send({
      embed: {
        color: 0x4c32a8,
        description: "this is a developer only command",
        author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        }
      }
    })
  };
  message.channel.send({ content: 'loading...' })
  const results = await userSchema.find({ })
  let userId;
  let user;
  for (let result of results) {
    userId = result.userId;
    user = await client.users.fetch(userId);
    await userSchema.findOneAndUpdate({
      userId,
    }, {
      userName: user.tag,
    }, {
      upsert: true,
    })
  };
  return message.reply({ content: `done lord ${message.author}` })
}

module.exports.help = {
  name: "syname"
};
