const userSchema = require('../schemas/userSchema')

module.exports.run = async(client, message, args) => {
  const option = await userSchema.findOne({
    userId: message.author.id,
  });
  if (option.mention === true) {
    await userSchema.findOneAndUpdate({
      userId: message.author.id,
    }, {
      mention: false,
    }, {
      upsert: true,
    })
    return message.reply({ content: 'Disabled level up mentions.', ephemeral: true })
  } else {
    await userSchema.findOneAndUpdate({
      userId: message.author.id,
    }, {
      mention: true,
    }, {
      upsert: true,
    })
    return message.reply({ content: 'Enabled level up mentions.', ephemeral: true })
  }

}

module.exports.help = {
  name: "toggle-mention",
};
