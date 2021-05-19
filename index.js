const {Client, Intents} = require('discord.js');
const auth = require('./auth.json');
const getJSON = require('get-json');
const fs = require('fs');

// Initialize Cloud Firestore
const admin = require('firebase-admin');
const serviceAccount = require('./googleServiceAuth.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Load all command files and create empty map. Map will be populated when the bot is ready
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let commands = new Map();

// Set intents of the client
const clientIntents = new Intents();
clientIntents.add('GUILD_MESSAGES');

// Initialize Discord Bot (client)
const client = new Client({intents: clientIntents});

// When the client first starts
client.once('ready', () => {
    console.log('I am ready!'); 

    /* List all commands in the specified guild:
    client.guilds.cache.get(auth.guildID).commands.fetch()
        .then(commands => commands.forEach((command) => console.log(command)))
        .catch(console.error);
    */
    /* Delete command from guild. Retrieve command id using the previous command list.
    client.guilds.cache.get(auth.guildID).commands.delete('843936307906609202');
    */

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
    
        // set a new item in the Collection, key is command name value is exported module
        commands.set(command.name, command);

        commandData = {
            name: command.name,
            description: command.description,
            options: command.options
        }

        // Add guild command
        // client.guilds.cache.get(auth.guildID).commands.create(commandData);

        // Add global command
        client.application?.commands.create(commandData);
    }
});

// When a slash command is performed
client.on('interaction', (interaction) => {
    // If the interaction isn't a slash command, return
    if (!interaction.isCommand() || !commands.has(interaction.commandName)) return;

    try {
        commands.get(interaction.commandName).execute(interaction, client, db);
    } catch (error) {
        console.error(error);
        interaction.reply('An unknown error occurred.');
    }
    
})

client.login(auth.token);
