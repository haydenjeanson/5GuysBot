const Discord = require('discord.js');
const auth = require('./auth.json');
const getJSON = require('get-json');
const fs = require('fs');

// Initialize Discord Bot
const bot = new Discord.Client();
const INSULT_PATH = 'insults.txt'
const QUOTE_PATH = 'quotes.txt'
const LINKS_PATH = 'links.txt'

function joke(category,time,message){
    getJSON('https://www.reddit.com/r/jokes/' + category + '.json?t=' + time, (err, response) => {
        
        var titleArr = [];
        var answerArr = [];

        if(!err){
            if(response.data.children!=''){
                response.data.children.forEach((child) => {
                    titleArr.push(child.data.title);
                    answerArr.push(child.data.selftext);

                });
    
                var num_posts= titleArr.length;
                var post_load_num = Math.round(Math.random() * (num_posts - 1));
                message.channel.send(titleArr[post_load_num] + '\n||' + answerArr[post_load_num] + '||');
            }else{
                message.channel.send("Empty response.");

            }
            
        }else{
            message.channel.send("Invalid URL.");
            
        }
    }).catch(function(){
        console.log("Error has occured");
    });   
}

function parseSubreddit(subName,category,time,message){

    getJSON('https://www.reddit.com/r/' + subName + '/' + category + '.json?t=' + time, (err, response) => {
        
        var subArr = [];

        if(!err){
            if(response.data.children!=''){
                response.data.children.forEach((child) => {
                    subArr.push(child.data.title);
                });
    
                var num_posts= subArr.length;
                var post_load_num = Math.round(Math.random() * (num_posts - 1));
                message.channel.send(subArr[post_load_num]);
            }else{
                message.channel.send("Empty subreddit.");

            }
            
        }else{
            message.channel.send("Invalid subreddit URL.");
            
        }
    }).catch(function(){
        console.log("Error has occured");
    });   
}


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

            case 'quotelist':
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
		    quoteString = '';

	  	    if (user != '') {	
			    
	                for (var i = 0; i < numQuotes; i++) {
			    quoteString = quoteString.concat(quoteArr[validQuotes[i]][1] + '\n');
			}

                    	try {
                        	const embed = new Discord.RichEmbed()
	                            // Set the title of the field
	                            .setTitle(quoteArr[validQuotes[0]][0])
	                            // Set the color of the embed
	                            .setColor(0xFF0000)
	                            // Set the main content of the embed
	                            .setDescription(quoteString);
	                            // Send the embed to the same channel as the message
	                        message.channel.send(embed);
	                } catch (err) {
	                    message.channel.send("No quotes found.");
	                }
		    } else {
			var numChars = 0;
			quoteArr.forEach((line) => {
				numChars += line[0].length + line[1].length + 7;
			});
			var numMsgs = Math.ceil(numChars / 1950);

			if (numMsgs > 1) {
				quoteString = []
				for (var i = 0; i < numMsgs; i++) {
					quoteString.push('');
				}
			}
			
			var totalLength = 0;
			var currentMsg = 0;
                    	for (var i = 0; i < numQuotes; i++) {
				var additionLength = (quoteArr[validQuotes[i]][0].length + 7 + quoteArr[validQuotes[i]][1].length);
				if (totalLength + additionLength > 1950) {
					currentMsg++;
					totalLength = 0;
				}
				totalLength += additionLength;
				quoteString[currentMsg] = quoteString[currentMsg].concat('     ' + quoteArr[validQuotes[i]][0]);
				quoteString[currentMsg] = quoteString[currentMsg].concat(": ");
	              		quoteString[currentMsg] = quoteString[currentMsg].concat(quoteArr[validQuotes[i]][1] + '\n');
      		        }

                    	try {
	                	
				message.channel.send("------------ All Quotes ------------");
				for (var i = 0; i < numMsgs; i++) {
					message.channel.send(quoteString[i]);
				}
	                } catch (err) {
	                    message.channel.send('No quotes found.');
			    console.log(err);
	                }
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

                    message.channel.send("You made this insult? I made this insult.");
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

                    message.channel.send("Quote added.");
                });
            break;

            case 'link':
                var user = '';
                if (args.length > 0) {
                    user = args[0];
                }

                
                fs.readFile(LINKS_PATH, 'utf-8', (err, data) => {
                    if (err) throw err;

                    var linksArr = [];

                    linksArr = data.split('\n');
                    linksArr.pop();
                    
                    var i = 0;
                    var validLinks = [];
                    linksArr.forEach((line) => {
                        line = line.split(';');
                        linksArr[i] = line;

                        if (user != '') {
                            if (line[0].toLowerCase() == user.toLowerCase()) {
                                validLinks.push(i);
                            }
                        } else {
                            validLinks.push(i);
                        }

                        i++;
                    });
                    
                    numQuotes = validLinks.length;
                    rndNum = Math.round(Math.random() * (numQuotes - 1));

                    console.log(numQuotes + '|' + rndNum)
                    try {
                        const embed = new Discord.RichEmbed()
                            // Set the title of the field
                            .setTitle(linksArr[validLinks[rndNum]][0])
                            // Set the color of the embed
                            .setColor(0xFF0000)
                            // Set the main content of the embed
                            .setDescription(linksArr[validLinks[rndNum]][1]);
                            // Send the embed to the same channel as the message
                        message.channel.send(embed);
                    } catch (err) {
                        message.channel.send("No links found.");
                    }
                });
            break;

            case 'links':
                var user = '';
                if (args.length > 0) {
                    user = args[0];
                }

                
                fs.readFile(LINKS_PATH, 'utf-8', (err, data) => {
                    if (err) throw err;

                    var linksArr = [];

                    linksArr = data.split('\n');
                    linksArr.pop();
                    
                    var i = 0;
                    var validLinks = [];
                    linksArr.forEach((line) => {
                        line = line.split(';');
                        linksArr[i] = line;

                        if (user != '') {
                            if (line[0].toLowerCase() == user.toLowerCase()) {
                                validLinks.push(i);
                            }
                        } else {
                            validLinks.push(i);
                        }

                        i++;
                    });
                    
                    numLinks = validLinks.length;
		    linksString = '';

	  	    if (user != '') {	
			    
	                for (var i = 0; i < numLinks; i++) {
			    linksString = linksString.concat(linksArr[validLinks[i]][1] + '\n');
			}

                    	try {
                        	const embed = new Discord.RichEmbed()
	                            // Set the title of the field
	                            .setTitle(linksArr[validLinks[0]][0])
	                            // Set the color of the embed
	                            .setColor(0xFF0000)
	                            // Set the main content of the embed
	                            .setDescription(linksString);
	                            // Send the embed to the same channel as the message
	                        message.channel.send(embed);
	                } catch (err) {
	                    message.channel.send("No quotes found.");
	                }
		    } else {
			var numChars = 0;
			linksArr.forEach((line) => {
				numChars += line[0].length + line[1].length + 7;
			});
			var numMsgs = Math.ceil(numChars / 1950);

			if (numMsgs > 1) {
				linksString = []
				for (var i = 0; i < numMsgs; i++) {
					linksString.push('');
				}
			}
			
			var totalLength = 0;
			var currentMsg = 0;
                    	for (var i = 0; i < numLinks; i++) {
				var additionLength = (linksArr[validLinks[i]][0].length + 7 + linksArr[validLinks[i]][1].length);
				if (totalLength + additionLength > 1950) {
					currentMsg++;
					totalLength = 0;
				}
				totalLength += additionLength;
				linksString[currentMsg] = linksString[currentMsg].concat('     ' + linksArr[validLinks[i]][0]);
				linksString[currentMsg] = linksString[currentMsg].concat(": ");
	              		linksString[currentMsg] = linksString[currentMsg].concat(linksArr[validLinks[i]][1] + '\n');
      		        }

                    	try {
	                	
				message.channel.send("------------ All Links ------------");
				for (var i = 0; i < numMsgs; i++) {
					message.channel.send(linksString[i]);
				}
	                } catch (err) {
	                    message.channel.send('No links found.');
			    console.log(err);
	                }
		    }
                });
            break;

            case 'addlink':
                fs.open(LINKS_PATH, 'a', (err, fd) => {
                    if (err) throw err;

                    var linkName = args[0];
                    
                    args = args.slice(1);

                    var linkStr = '';
                    args.forEach((item) => {linkStr = linkStr.concat(' ', item)});

                    fs.write(fd, linkName.trim() + ';' + linkStr.trim() + '\n', (err) => {if (err) throw err});

                    fs.close(fd, (err) => {
                        if (err) throw err;
                    });

                    message.channel.send("Link added.");
                });
            break;


            case 'thought':
                parseSubreddit("showerthoughts","top","month",message);
               
            break;

            case 'fact':
                parseSubreddit("todayilearned","top","month",message);
               
            break;

            case 'joke':
                switch(args.length){
                    case 0:
                        joke("top","month",message);
                    break;
                    case 1:
                        joke(args[0],"month",message);
                    break;
                    case 2:
                        joke(args[0],args[1],message);
                    break;

                }
            break;

            case 'sub':
                switch(args.length){
                    case 0:
                        message.channel.send("Require a subreddit to use. Try \' sub showerthoughts top all\'");
                    break;
                    case 1:
                        if(args[0] =="help")
                            message.channel.send("Usage: !sub <subreddit> <category> <time>\nCan be used by: !sub showerthoughts top all\nTime and category can be omitted.")
                        else
                            parseSubreddit(args[0],"top","month",message);
                    break;
                    case 2:
                        parseSubreddit(args[0],args[1],"month",message);
                    break;
                    case 3:
                        parseSubreddit(args[0],args[1],args[2],message);
                    break;
                }
    

            break;



            case 'help':
                message.channel.send('Available Commands:\n\n\
            !ping - The bot responds Pong!\n\
            !marco - The bot responds Polo!\n\
            !insult - Sends an insult randomly chosen from the top posts of the last month on r/insults\n\
            !addinsult - Adds a new insult\n\
            !quote - Sends a random quote from the quotes that have been added using !addquote\n\
            !addquote <name> - Add a quote said by <name>\n\
            !quotelist <name> - List all quotes said by <name>\n\
            !link - Sends a random link from the links that have been added using !addlink\n\
            !addlink <name> - Add a link said by <name>\n\
            !links <name> - List all links said by <name>\n\
            !thought - Sends an showerthought randomly chosen from the top posts of the last month on r/showerthoughts\n\
            !fact - Sends a fact randomly chosen from the top posts of the last month on r/todayilearned\n\
            !sub - Display a post from any subreddit given a name, and optional category and time. See !sub help\n\
            !joke - Sends a joke randomly chosen from r/jokes, from top month by default, or any category or time given \n\
            ')
                    
            break;
         }
     }
});

bot.login(auth.token);
