const Discord = require('discord.js');
const helpers = require('./helpers.js');
const bot = new Discord.Client();
 bot.on('ready', () => {
     console.log('Nico Nico Nii');
     bot.user.setUsername("Nico Yazawa");
 });

let prefix = process.env.PREFIX;
bot.on('message', (message) => {
  if(message.author.bot) return;
  helpers.handleMessageDeletions(message);
  helpers.handleLinkDeletions(message);
  if (message.content == 'hi') {
        message.channel.sendMessage('Nico Nico Nii');
    }
  if (message.content == 'hola') {
          message.channel.sendMessage('Nico Nico Nii');
      }
  if (message.content == 'hello') {
            message.channel.sendMessage('Nico Nico Nii');
        }
});
bot.login(process.env.TOKEN);
