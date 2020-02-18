var Discord = require('discord.js');
var auth = require('./auth.json');

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on('message', async (message) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.includes(":Kappapride:")) {
        // await new Promise(r => setTimeout(r, 1000));
        message.channel.send('HA! GaaAAAY!');
    }

    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                message.channel.send('Pong!')
            break;
            // Just add any case commands if you want to..
         }
     }
});

bot.login(auth.token);