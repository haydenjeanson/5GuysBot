const Discord = require('discord.js');
const auth = require('./auth.json');
const getJSON = require('get-json');

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on('message', async (message) => {
    if (message.content.includes(":Kappapride:")) {
        await new Promise(r => setTimeout(r, 1000));
        message.channel.send('HA! GaaAAAY!');
    }

    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');

        switch(args[0].toLowerCase()) {
            // !ping
            case 'ping':
                message.channel.send('Pong!')
            break;
            case 'marco':
                message.channel.send('Polo!');
            break;
            case 'insult':
                var user = ""
                if (args.length > 1) {
                    user = message.mentions.members.first();
                }

                getJSON('https://www.reddit.com/r/insults/top.json?t=month', (error, response) => {
                    numInsults = response.data.children.length
                    rndNum = Math.round((Math.random() * numInsults) - 1);

                    if (user != "") {
                        message.channel.send(user + ', ' + response.data.children[rndNum].data.title);
                    } else {
                        message.channel.send(response.data.children[rndNum].data.title);
                    }
                });
            break;
            case 'help':
                message.channel.send('Available Commands:\n\n!ping - The bot responds Pong!\n!marco - The bot responds Polo!\n!insult - Sends an insult randomly chosen from the top posts of the last month on r/insults')
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