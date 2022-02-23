module.exports.run = (client, message, args) => {
    return message.reply({ content: `Pong! ${Math.round(client.ws.ping)}` });
}

module.exports.help = {
    name: "ping"
};
