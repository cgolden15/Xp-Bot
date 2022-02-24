const { MessageEmbed } = require("discord.js");
const userSchema = require('../schemas/userSchema')

module.exports.run = async (client, message, args) => {

  const data = await userSchema.find().sort({ points: -1 });

  if (data.length < 1) return message.channel.send("No leaderboard");
  let myrank = data.map(data => data.userId).indexOf(message.author.id) + 1 || "N/A";

  data.length = 5;
  let lb = [];
  for (let i in data) {
    let id = data[i].userId;
    let user = data[i].userName;
    // let user = await client.users.fetch(id);
    // user = user ? user.tag : "Unknown User#0000";
    let rank = data.indexOf(data[i]) + 1;
    let points;
    if (data[i].points > 0) {
      points = data[i].points;
    } else {
      continue
    }
    lb.push({
      user: { id, tag: user },
      rank,
      points,
    });
  };
  const embed = new MessageEmbed()
    .setTitle("Leaderboard")
    .setDescription("Users with the most points!")
    .setColor("RANDOM")
  lb.forEach(d => {
    embed.addField(`${d.rank}. ${d.user.tag}`, `**Points** - ${d.points}`);
  });
  embed.setFooter(`Your Position: ${myrank}`);
  return message.channel.send({ embeds: [embed] });
};

module.exports.help = {
  name: "pointleaderboard"
};
