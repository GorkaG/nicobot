const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const {isAdmin} = require('./helpers/admin');
const helpers = require('./helpers.js');


const NO_ADMIN_EXCEPTION = "noAdminException";


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
    const isCommand = message.content.startsWith(prefix);

    if (isCommand) {
        const args = message.content.slice(prefix.length).split(/ +/).filter(v => v != "");
        const command = args.shift().toLowerCase();
        if (command == "help") {
            bot.commands.get(command).execute(message, bot.commands);
            return;
        }
        if (command == "adminhelp") {
            bot.commands.get(command).execute(message, bot.commands);
            return;
        }
        try {
            const command = bot.commands.get(command);
            isAdmin(message.guild,message.author)
            .then(isAdmin => {
                if((command.isAdminCommand && isAdmin) || !command.isAdminCommand){
                    execute(message, args);
                }
                else if(command.isAdminCommand) {
                    if(!isAdmin){
                        throw NO_ADMIN_EXCEPTION;
                    }
                }
            })
        }
        catch (error) {
            if(error === NO_ADMIN_EXCEPTION){
                console.log("someone is trying to invoke admin commands from non admin");
            }
            else{
                console.error(error);
                message.reply('there was an error trying to execute that command!');
            }
        }
    }
    // filter function
    else {
        helpers.isChannelLocked(message).then(locked => {
            if (locked) {
                helpers.handleMessageDeletions(message);
                helpers.handleLinkDeletions(message);
            }
        });
    }
});
bot.login(process.env.BOT_TOKEN);
