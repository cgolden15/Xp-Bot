const { MessageEmbed } = require("discord.js");
const userSchema = require('../schemas/userSchema')

module.exports.run = async (client, message, args) => {

  const data = await userSchema.find().sort({ xp: -1 });

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
    let level = data[i].level;
    let xp = data[i].xp;
    let xpreq = level * 200
    lb.push({
      user: { id, tag: user },
      rank,
      level,
      xp,
      xpreq
    });
  };

  // let data = client.db.all().filter(i => i.ID.startsWith("xp_")).sort((a, b) => b.data - a.data);
  // if (data.length < 1) return message.channel.send("No leaderboard");
  //let myrank = data.map(m => m.ID).indexOf(`xp_${message.author.id}`) + 1 || "N/A";
  // data.length = 5;
  // let lb = [];
  // for (let i in data) {
  //   let id = data[i].ID.split("_")[1];
  //   let user = await client.users.fetch(id);
  //   user = user ? user.tag : "Unknown User#0000";
  //   let rank = data.indexOf(data[i]) + 1;
  //   let level = client.db.get(`level_${id}`);
  //   let xp = data[i].data;
  //   let xpreq = Math.floor(Math.pow(level / 0.1, 2));
  //   lb.push({
  //     user: { id, tag: user },
  //     rank,
  //     level,
  //     xp,
  //     xpreq
  //   });
  // };

  const embed = new MessageEmbed()
    .setTitle("Leaderboard")
    .setDescription("View the full leaderboard [here](https://robloxianadventures.com/leaderboard)!\nView the XP distribution [here](https://robloxianadventures.com/leaderboard/distribution)!")
    .setColor("RANDOM")
  lb.forEach(d => {
    embed.addField(`${d.rank}. ${d.user.tag}`, `**Level** - ${d.level}\n**XP** - ${d.xp} / ${d.xpreq}`);
  });
  embed.setFooter(`Your Position: ${myrank}`);
  return message.channel.send({ embeds: [embed] });
};

module.exports.help = {
  name: "leaderboard",
  aliases: ['lb']
};
