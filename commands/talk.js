

const NO_ADMIN_EXCEPTION = "noAdminException";
const NO_CHANNEL_EXCEPTION = "noChannelException";
const NO_MESSAGE_EXCEPTION = "noMessageException";
const WAIT_TIME = 10000;
const {isAdmin} = require('../helpers/admin');
module.exports = {
    name: 'talk',
    description: 'Your next message will be said as if you were the bot on the selected channel',
    isAdminCommand: true,
    execute(message, args) {
        const guild = message.guild;
        const author = message.author;
        const channels = message.mentions.channels;
        let channelWillTalk;
        const isAdminQuery = isAdmin(guild,author);
        
        isAdminQuery
            .then(isAdmin =>{
                if(!isAdmin){
                    throw NO_ADMIN_EXCEPTION;
                }
            })
            .then(()=>{
                if(channels.first() === undefined){
                    throw NO_CHANNEL_EXCEPTION;
                }
                channelWillTalk = channels.first();
            })
            .then(() =>{
                const filter = nextMessage => nextMessage.author.id === message.author.id;
                message.channel.send("The next message will be written as nico <:NicoNicoNii:360455426745303041> ")
                return message.channel.awaitMessages(filter,{max:1, time: WAIT_TIME })
            })
            .then(collectedMessages => {
                if(collectedMessages.first() === undefined){
                    throw NO_MESSAGE_EXCEPTION;
                }
                channelWillTalk.send(collectedMessages.first().content);
            })
            .catch(error =>{
                if(error === NO_ADMIN_EXCEPTION){
                    console.log("someone is trying to invoke admin commands from non admin");
                } else if(error === NO_CHANNEL_EXCEPTION){
                    message.channel.send("You must provide a channel where you want to talk");
                } else if(error === NO_MESSAGE_EXCEPTION){
                    message.channel.send("You must provide a message to talk");
                } else {
                    console.log("UNKNOWN Error on talk",error)
                }
                
            })
            
    },
};
