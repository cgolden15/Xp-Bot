const Discord = require("discord.js");
const fs = require("fs");
const talkedRecently = new Set();
const mongoose = require("mongoose");
const userSchema = require('./schemas/userSchema');
const multiSchema = require('./schemas/multiSchema');
const Intents = Discord.Intents;
const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES
  ]
});

client.aliases = new Discord.Collection();
client.commands = new Discord.Collection();
client.cooldown = new Discord.Collection();
client.config = {
  TOKEN: `${process.env.discordToken}`,
  prefix: "!!",
  cooldown: 5000
};

// Load Commands
fs.readdir(`./commands/`, (error, files) => {
  if (error) { return console.log("Error while trying to get the commmands."); };
  files.forEach(file => {
    const command = require(`./commands/${file}`);
    const commandName = file.split(".")[0];

    client.commands.set(commandName, command)
    console.log(`Loaded command: ${commandName}`)

    if (command.aliases) {
    command.help.aliases.forEach(alias => {
      client.aliases.set(alias, commandName)
      console.log(`Set command alias: ${command} -> ${alias}`)
    })
    }
    // if (command.aliases) {
    //   command.aliases.forEach(alias => {
    //     client.aliases.set(alias, command);
    //     console.log(`Set command alias: ${command} -${alias}`)
    //   });
    // };
  });
});


// Events
client.once("ready", async () => {
  console.clear()
  console.log(`Ready! Logged in as ${client.user.tag}`);
  client.user.setActivity(`your disgusting messages`, { type: "WATCHING" })

  //Connect to mongoDB
  await mongoose.connect(process.env.mongoUri, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Connected to mongo")
  }).catch((err) => {
    console.log(err)
  })
});

client.on("error", console.error);

client.on("warn", console.warn);


client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  // Handle XP
  if (!talkedRecently.has(message.author.id)) {
    xp(message)
    client.channels.cache.get('934285396454547546').send({ content: `XP given to ${message.author.tag}-${message.author.id} from a message in "${message.guild.name} - ${message.channel.name}` })
  }
  // command handler
  if (!message.content.startsWith(client.config.prefix)) return;
  let args = message.content.slice(client.config.prefix.length).trim().split(" ");
  let command = args.shift().toLowerCase();
  let commandFile = client.commands.get(command) || client.aliases.get(command);
  if (!commandFile) return;
  commandFile.run(client, message, args);
  //Cooldown handler
  talkedRecently.add(message.author.id);
  setTimeout(() => {
    talkedRecently.delete(message.author.id);
  }, 5000);
});

async function xp(message) {
  const multi = await multiSchema.findOne({
    userId: message.author.id,
  });
  let result;

  if (multi) {
    result = await userSchema.findOneAndUpdate({
      userId: message.author.id,
    }, {
        username: message.author.tag,
        $inc: {
          xp: 5 * multi.multiplier,
        },
      }, {
        upsert: true,
        new: true,
      });

  } else {
    result = await userSchema.findOneAndUpdate({
      userId: message.author.id,
    }, {
        userName: message.author.tag,
        $inc: {
          xp: 5
        },
      }, {
        upsert: true,
        new: true,
      });

  }

  let xp = result.xp;
  let lvl = result.level;

  if (xp >= lvl * 200) {
    let newLevel = await userSchema.findOneAndUpdate({
      userId: message.author.id,
    }, {
        $inc: {
          level: 1
        },
      }, {
        upsert: true,
        new: true,
      })
    
    if (result.mention === true) {
      client.channels.cache.get('935731982388846662').send({ content: `<@${message.author.id}> has ranked up to level ${newLevel.level}!!` })
    } else {
      client.channels.cache.get('935731982388846662').send({ content: `${message.author.tag} has ranked up to level ${newLevel.level}!!` })
    }
   
  }
}

const check = async () => {
  const query = {
    expires: { $lt: new Date() },
  };

  
  await multiSchema.deleteMany(query)
  setTimeout(check, 1000 * 60)
}
check()

client.login(process.env.discordToken);

