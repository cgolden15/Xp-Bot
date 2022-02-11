const userSchema = require('../schemas/userSchema')

module.exports.run = async (client, message, args) => {
    let user = client.users.cache.get(args[1])
    
    if(args[2]) { // if theres a point value provided
        let points = args[2]
    
        // set to 0 points if user doesnt have any

        let originalPoints = a//whatever users points were before they get updated

        // add/remove points

        let newPoints = b//users points after being updated

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("League Points edited!")
            .setDescription(`${user.tag}'s league points has been updated!'`)
            .addField(
                { name: `Originally:`, value: `${originalPoints}`, inline: true},
                { name: `Now:`, value: `${newPoints}`, inline: true}
            )
            .setFooter('Robloxian Adventures Training Academy')
            .setTimestamp();
        
         message.channel.send(embed);

    } else {

        let points = c// get current points

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("League Points:")
            .setDescription(`${user.tag} has ${points} League Points.`)
        message.channel.send(embed);
    }

};

module.exports = {
  name: "points"
};