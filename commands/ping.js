module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    options: [],
    execute(_, interaction) {
        interaction.reply('Pong!', {ephemeral: true});
    }
}