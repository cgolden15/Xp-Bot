const userSchema = require('../schemas/userSchema')
const { MessageEmbed } = require('discord.js')

module.exports.run = async (client, message, args) => {

  let user = client.users.cache.get(args[0]) || message.author

  if (args[1]) { // if theres a point value provided
    if (!message.member.roles.cache.some(r => ["RA Executives", "League Management", "Champions League Leader", "All-Star League Leader", "Beginners League Leader", "Champion League Host", "All-Star League Host", "Beginners League Host", "Jr. Developer", "CEO"].includes(r.name))) {
      message.reply({ content: 'You cant run that command... ' })
      return;
    }
    let changepoints = args[1]

    // set to 0 points if user doesnt have any

    let originalPoints = await userSchema.findOne({
      userId: user.id,
    }); //whatever users points were before they get updated

    // add/remove points

    let newPoints = await userSchema.findOneAndUpdate({
      userId: user.id,
    }, {
        $inc: {
          points: changepoints,
        },
      }, {
        upsert: true,
        new: true,
      });  //users points after being updated

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("League Points edited!")
      .setDescription(`${user.tag}'s league points has been updated!`)
      .addFields(
        {
          name: `Originally`,
          value: `${originalPoints.points}`,
        }, {
          name: `Now:`,
          value: `${newPoints.points}`,
        },
      )
      .setFooter('[RA] Training Academy')
      .setTimestamp();

    message.channel.send({ embeds: [embed] });

  } else {

    let pointsnum = await userSchema.findOne({
      userId: user.id,
    }); // get current points

    if (!pointsnum) {
      await new userSchema({
        userId: user.id,
      }).save()
      pointsnum = 0
    };

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("League Points")
      .setDescription(`${user.tag} has ${pointsnum.points} League Points.`)
      .setFooter('[RA] Training Academy')
      .setTimestamp()
    message.channel.send({ embeds: [embed] });
  }

};

module.exports.help = {
  name: "points"
};
