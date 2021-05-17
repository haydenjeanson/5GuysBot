const { Interaction } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    options: [],
    execute(interaction) {
        interaction.reply('Pong!');
    }
}