const { MessageEmbed } = require('discord.js')
var format1 = "```js"
var format2 = "```"

module.exports.run = async (client, message, args) => {
  const devIds = ["317283391982534666", "74000022229771887"]
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
  }
  let message2 = args.join(' ');
  if (!message2) {
    return message.channel.send({
      embed: {
        color: 0x4c32a8,
        description: "Cant eval noting",
        author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        }
      }
    });
  }
  let thisthing = args.join(' ');
  let evaled = eval(thisthing)
  return message.channel.send({
    embed: {
      color: 0x4c32a8,
      fields: [{
        name: "To evaluate:",
        value: format1 + "\n" + thisthing + "\n" + format2,
      },
      {
        name: "Result:",
        value: format1 + "\n" + evaled + "\n" + format2,
      }],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatar_url,
        text: "Imagine not being able to use eval"
      }
    }
  })
}

module.exports.help = {
  name: "eval",
};
