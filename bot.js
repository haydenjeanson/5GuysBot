const Discord = require('discord.js');
const auth = require('./auth.json');
const getJSON = require('get-json');
const fs = require('fs');

// Initialize Discord Bot
const bot = new Discord.Client();
const INSULT_PATH = 'insults.txt'
const QUOTE_PATH = 'quotes.txt'

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

                getJSON('https://www.reddit.com/r/insults/top.json?t=month', (err, response) => {
                    fs.readFile(INSULT_PATH, 'utf-8', (err, data) => {
                        if (err) throw err;

                        var insultArr = [];

                        insultArr = data.split('\n');
                        insultArr.pop();

                        response.data.children.forEach((child) => {
                            insultArr.push(child.data.title);
                        });

                        numInsults = insultArr.length;
                        rndNum = Math.round(Math.random() * (numInsults - 1));

                        if (user != "") {
                            message.channel.send(user + ', ' + insultArr[rndNum]);
                        } else {
                            message.channel.send(insultArr[rndNum]);
                        }
                    });
                });
            break;

            case 'quote':
                var user = '';
                if (args.length > 0) {
                    user = args[0];
                }

                
                fs.readFile(QUOTE_PATH, 'utf-8', (err, data) => {
                    if (err) throw err;

                    var quoteArr = [];

                    quoteArr = data.split('\n');
                    quoteArr.pop();
                    
                    var i = 0;
                    var validQuotes = [];
                    quoteArr.forEach((line) => {
                        line = line.split(';');
                        quoteArr[i] = line;

                        if (user != '') {
                            if (line[0].toLowerCase() == user.toLowerCase()) {
                                validQuotes.push(i);
                            }
                        } else {
                            validQuotes.push(i);
                        }

                        i++;
                    });
                    
                    numQuotes = validQuotes.length;
                    rndNum = Math.round(Math.random() * (numQuotes - 1));

                    console.log(numQuotes + '|' + rndNum)
                    try {
                        const embed = new Discord.RichEmbed()
                            // Set the title of the field
                            .setTitle(quoteArr[validQuotes[rndNum]][0])
                            // Set the color of the embed
                            .setColor(0xFF0000)
                            // Set the main content of the embed
                            .setDescription(quoteArr[validQuotes[rndNum]][1]);
                            // Send the embed to the same channel as the message
                        message.channel.send(embed);
                    } catch (err) {
                        message.channel.send("No quotes found.");
                    }
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
            case 'addquote':
                fs.open(QUOTE_PATH, 'a', (err, fd) => {
                    if (err) throw err;

                    var quoteName = args[0];
                    
                    args = args.slice(1);

                    var quoteStr = '';
                    args.forEach((item) => {quoteStr = quoteStr.concat(' ', item)});

                    fs.write(fd, quoteName.trim() + ';' + quoteStr.trim() + '\n', (err) => {if (err) throw err});

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
});

bot.login(auth.token);