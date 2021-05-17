const {Client, Intents} = require('discord.js');
const auth = require('./auth.json');
const getJSON = require('get-json');
const fs = require('fs');

// Set intents of the client
const clientIntents = new Intents();
clientIntents.add('GUILD_MESSAGES');
clientIntents.add('GUILD_MESSAGE_TYPING');
// Initialize Discord Bot
const client = new Client({intents: clientIntents});

const commandData = {
    name: 'echo',
    description: 'Replies with your input!',
    options: [{
      name: 'input',
      type: 'STRING',
      description: 'The input which should be echoed back',
      required: true,
    }],
  };

client.once('ready', () => {
    console.log('I am ready!'); 

    client.guilds.cache.get(auth.guildID).commands.create(commandData);
});

client.on('interaction', interaction => {
    // If the interaction isn't a slash command, return
    if (!interaction.isCommand()) return;

    // Check if it is the correct command
    if (interaction.commandName === 'echo') {
        // Get the input of the user
        const input = interaction.options[0].value;
        // Reply to the command
        interaction.reply(input);
    }
})

client.login(auth.token);
