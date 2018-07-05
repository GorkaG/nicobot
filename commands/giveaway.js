var{Collection} = require('discord.js');
const MAX_TIME = 10000;

function makeFilters(author) {
    let currentAuthor = author;
    return {
        authorFilter(message){
            return message.author.id == currentAuthor.id;
        },
        authorAndChannelFilter(message){
            return message.author.id == currentAuthor.id && message.mentions.channels.first();
        },
        authorAndTimeFilter(message){
            return message.author.id === currentAuthor.id && !isNaN(message.content)
        },
        reactionsFilter(reaction,user){
            return reaction.emoji.name === '👍' && !user.bot;;
        }
    }
}
function makeSteps(filter,channel) {
    let currentFilter = filter;
    let currentChannel = channel;
    let targetChannel;
    let time;
    let prize;
    return {
        askChannel(){
            return currentChannel.awaitMessages(currentFilter.authorAndChannelFilter, { max: 1, time: MAX_TIME, errors: ['time'] })
        },
        askDuration(){
            currentChannel.send("Set the duration in seconds");
            return currentChannel.awaitMessages(currentFilter.authorAndTimeFilter, { max: 1, time: MAX_TIME, errors: ['time'] });
        },
        askPrize(){
            currentChannel.send("Set the prize");
            return currentChannel.awaitMessages(currentFilter.authorFilter, { max: 1, time: MAX_TIME, errors: ['time'] });
        },
        startGiveaway(){
            return targetChannel.send(`
            Let the giveaway begin
        Duration ${time}
        Prize: ${prize}
            `)
            .then(message => {
                message.react("👍");
                return message.awaitReactions(currentFilter.reactionsFilter,{time: time*1000});
            })
        },
       
        giveResults(messageReactions){
            if(messageReactions === undefined){
                throw Error;
            }
            const messageReaction = messageReactions.first();
            targetChannel.send(messageReaction.users.reduce((acc,next)=> acc+=`, ${next}`,''));
        },
        handleErrors(error){
            if(error instanceof Collection){
                channel.send("Time out!");
            }
            else if(error instanceof Error){
                channel.send("No one voted");
            }
            else{
                throw error;
            }
        },
        
        saveChannel(collectedMessages){
            targetChannel = collectedMessages.first().mentions.channels.first();
        },
        saveTime(collectedMessages){
            time = collectedMessages.first().content;
        },
        savePrize(collectedMessages){
            prize = collectedMessages.first().content;
        },
        getChannel(){
            return targetChannel;
        },
        getTime(){
            return time;
        }
    }
}

module.exports = {
    name: 'giveaway',
    description: 'Start a giveaway',
    execute(message, args) {
        const filters = makeFilters(message.author);
        const steps = makeSteps(filters,message.channel);

        let channel;
        let time;

        message.channel.send("Let's set upp the give away, give the channel where you want it to be")
        .then(steps.askChannel)
        .then(steps.saveChannel)
        .then(steps.askDuration)
        .then(steps.saveTime)
        .then(steps.askPrize)
        .then(steps.savePrize)
        .then(()=>message.channel.send(`Almost there channel: ${steps.getChannel()} and time ${steps.getTime()}`))
        .then(steps.startGiveaway)
        .then(steps.giveResults)
        .catch(steps.handleErrors)
        .catch(error => console.log(error));
    },
};

