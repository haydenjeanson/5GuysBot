A bot to play around with on a discord server.

To use, you will need to create a discord bot at https://discordapp.com/developers/applications

Once you have a bot, create an auth.json file with the following code:

{
  "token": "YOUR_TOKEN_GOES_HERE"
}

The token is generated by discord and can be found on your bots page.

Add your bot to a server using https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8  
Replace CLIENTID with your client id, found on your application general information page

node.js is required to run the bot. Download at https://nodejs.org/en/
Once node.js is installed, you can run npm install in the folder with all of the bot files to install the required dependencies.
Finally, launch the bot with:

node bot.js

Try it out with !ping in your server.
The bot should respond Pong! so that you know it's working.
