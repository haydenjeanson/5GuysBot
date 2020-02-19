const Discord = require('discord.js');
const auth = require('./auth.json');
const getJSON = require('get-json');
const fs = require('fs');

// Initialize Discord Bot
const bot = new Discord.Client();
const INSULT_PATH = 'insults.txt'

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
        var cmd = args[0];

        args = args.slice(1);

        switch(cmd.toLowerCase()) {
            case 'ping':
                message.channel.send('Pong!')
            break;

            case 'marco':
                message.channel.send('Polo!');
            break;

            case 'insult':
                var user = ""
                if (args.length > 0) {
                    user = message.mentions.members.first();
                }

                getJSON('https://www.reddit.com/r/insults/top.json?t=day', (err, response) => {
                    var insultArr = [];
                    fs.readFile(INSULT_PATH, 'utf-8', (err, data) => {
                        if (err) throw err;
                        insultArr = data.split('\n');
                        insultArr.pop();

                        response.data.children.forEach((child) => {
                            insultArr.push(child.data.title);
                        });

                        numInsults = insultArr.length;
                        rndNum = Math.round((Math.random() * numInsults) - 1);

                        if (user != "") {
                            message.channel.send(user + ', ' + insultArr[rndNum]);
                        } else {
                            message.channel.send(insultArr[rndNum]);
                        }
                    });

                    
                });
            break;
            case 'addinsult':
                fs.open(INSULT_PATH, 'a', (err, fd) => {
                    if (err) throw err;

                    var insultStr = '';
                    args.forEach((item) => {insultStr = insultStr.concat(' ', item)});

                    fs.write(fd, insultStr.trim() + '\n', (err) => {if (err) throw err});

                    fs.close(fd, (err) => {
                        if (err) throw err;
                    });
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