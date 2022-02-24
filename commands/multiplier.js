const userSchema = require('../schemas/userSchema');
const multiSchema = require('../schemas/multiSchema');
const ms = require('ms')
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
  if (!args[0]) {
    message.reply({ content: `command usage ${client.config.prefix}multiplier <user> <multiplier> <duration>` });
    return
  };

  let target = message.mentions.users.first() || client.users.cache.get(args[0]);
  let multiplier = args[1];
  if (!target) {
    message.reply({ content: 'Please mention who to give a multiplier to.' })
    return
  }
  args.shift()
  args.shift()
  let duration = args.join(' ')
  if (isNaN(ms(duration))) {
    message.reply({ content: `Invalid time.` })
    return
  }
  duration = ms(duration)
  const time = new Date()
  const expire = time + duration

  await multiSchema.findOneAndUpdate({
    userId: message.author.id,
  }, {
      multiplier,
      expires: expire,
    }, {
      upsert: true,
    });

  return message.reply({ content: 'Multiplier set.' })
}
module.exports.help = {
  name: "multiplier"
};
