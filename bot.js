const Discord = require('discord.js');
const auth = require('./auth.json');
const getJSON = require('get-json');

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on('message', async (message) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.includes(":Kappapride:")) {
        await new Promise(r => setTimeout(r, 1000));
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
            case 'insult':
                getJSON('https://www.reddit.com/r/insults/top.json?t=month', (error, response) => {
                    numInsults = response.data.children.length
                    rndNum = Math.round((Math.random() * numInsults) - 1);

                    message.channel.send(response.data.children[rndNum].data.title);
                });
            break;
         }
     }

     if (message.content === 'how to embed') {
        // We can create embeds using the MessageEmbed constructor
        // Read more about all that you can do with the constructor
        // over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
        const embed = new Discord.RichEmbed()
          // Set the title of the field
          .setTitle('A slick little embed')
          // Set the color of the embed
          .setColor(0xFF0000)
          // Set the main content of the embed
          .setDescription('Hello, this is a slick embed!');
        // Send the embed to the same channel as the message
        message.channel.send(embed);
     }
});

bot.login(auth.token);