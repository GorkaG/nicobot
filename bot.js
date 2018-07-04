const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const helpers = require('./helpers.js');

const bot = new Discord.Client();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

bot.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.on('ready', () => {
    console.log('Nico Nico Nii');
    bot.user.setUsername("Nico Yazawa");
});

bot.on('message', (message) => {
    if (message.author.bot) return;
    
    const args = message.content.slice(prefix.length).split(/ +/).filter(v => v != "");
    const command = args.shift().toLowerCase();
    const isCommand = bot.commands.has(command);

    if(isCommand){
        if(command == "help"){
            bot.commands.get(command).execute(message,bot.commands);
            return;
        }
        try {
            bot.commands.get(command).execute(message, args);
        }
        catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
    // filter function
    else{
        helpers.isChannelLocked(message).then(locked => {
                if (locked) {
                    helpers.handleMessageDeletions(message);
                    helpers.handleLinkDeletions(message);
                }
            });
    }
});
bot.login(process.env.BOT_TOKEN);
