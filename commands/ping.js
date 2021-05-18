const { CommandInteraction } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    options: [],
    /**
     * Handler for the ping command.
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        interaction.reply('Pong!', {ephemeral: true});
    }
}