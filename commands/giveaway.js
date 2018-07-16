var{Collection} = require('discord.js');
const MAX_TIME = 60000;

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
            return message.author.id === currentAuthor.id && !isNaN(message.content);
        },
        authorAndNumberFilter(message){
            return message.author.id === currentAuthor.id && !isNaN(message.content);
        },
        authorAndRoleFilter(message){
            return message.author.id === currentAuthor.id && message.mentions.roles.array().length !== 0;
        },
        reactionsFilter(reaction,user){
            //console.log(user);
            const returnedValue = reaction.emoji.name === 'NicoNicoNii' && !user.bot;
            return returnedValue;
        }
    }
}
function makeSteps(filter,channel) {
    let currentFilter = filter;
    let currentChannel = channel;
    let targetChannel;
    let time;
    let prize;
    let numberOfPrizes;
    let lastRoleExtraValue;
    let guild;

    function calculateWinner(users) {
        //console.log(users);
        let correctedUsers;
        let randomIndex;
        correctedUsers = users
            .map(userCollection => userCollection[1])
            .filter(user => !user.bot)
            .map(user => guild.members.find(member =>member.user.id === user.id))
            .reduce((acc,next) => {
                //console.log(next);
                if(next.roles.length !== 0){
                    const maxPositionRol = Math.max(...next.roles.map(rol => rol.position));
                    console.log("max position: ", maxPositionRol, " lastRoleExtraValue: ", lastRoleExtraValue.calculatedPosition );
                    if(maxPositionRol >= lastRoleExtraValue.calculatedPosition){
                        return [...acc,next,next];
                    }
                }
                return [...acc,next];
            },[])
        console.log(correctedUsers);
        randomIndex = getRandomInt(0,correctedUsers.length);
        return correctedUsers[randomIndex];
    }

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
        askNumberOfPrizes(){
            currentChannel.send("Set the number of winners");
            return currentChannel.awaitMessages(currentFilter.authorAndNumberFilter, { max: 1, time: MAX_TIME, errors: ['time'] });
        },
        askRoleExtraValue(){
            currentChannel.send("Set the last role with extra value");
            return currentChannel.awaitMessages(currentFilter.authorAndRoleFilter, {max: 1, time: MAX_TIME, errors: ['time']});
        },
        startGiveaway(){
            return targetChannel.send({embed:{
                title: ` ${prize} `,
                description: `React with <:NicoNicoNii:360455426745303041> to enter! `,
                color: 0x17A589,
                timestamp: new Date(Date.now() + time * 1000),
                footer: {
                text: `${numberOfPrizes} Winners | Ends at`
            }}})
            .then(message => {
                message.react("360455426745303041");
                return message.awaitReactions(currentFilter.reactionsFilter,{time: time*1000});
            })
        },
       
        giveResults(messageReactions){
            if(messageReactions === undefined || messageReactions.first() === undefined){
                throw "noVotes";
            }
            const messageReaction = messageReactions.first();
            const users = messageReaction.users;
            let popedUsers = [...users];
            let winners = [];
            let prizes =  Array(parseInt(numberOfPrizes)).fill(1);
            console.log("numbero fo prizes", numberOfPrizes);
            console.log("prices ", prizes);
            console.log("time ",time);
            prizes.forEach(()=>{
                if(popedUsers.length !== 0){
                    let winner = calculateWinner(popedUsers);
                    winners.push(winner);
                    popedUsers = popedUsers.filter(user => {console.log("filterUser",user[1].id !== winner.id);return user[1].id !== winner.id});
                    console.log("Rest of users: ", popedUsers.map(user => user));
                }
            });
            targetChannel.send("And the winners are: " + winners.reduce((acc,next)=> acc+=`, ${next}`,''));
        },
        handleErrors(error){
            if(error instanceof Collection){
                channel.send("Time out!");
            }
            else if(error === "noVotes"){
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
        saveNumberOfPrizes(collectedMessages){
            console.log("number of prices", collectedMessages.first().content);
            numberOfPrizes =  collectedMessages.first().content;
        },
        saveRoleExtraValue(collectedMessages){
            lastRoleExtraValue = collectedMessages.first().mentions.roles.first();
        },
        saveGuild(savedGuild){
            guild = savedGuild;
        },
        getChannel(){
            return targetChannel;
        },
        getTime(){
            return time;
        },
        
    }
}

module.exports = {
    name: 'giveaway',
    description: 'Start a giveaway',
    execute(message, args) {
        const filters = makeFilters(message.author);
        const steps = makeSteps(filters,message.channel);
        steps.saveGuild(message.guild);

        let channel;
        let time;

        message.channel.send("Alright! Let's set up your giveaway! First, what channel do you want the giveaway in? \n`Please type the name of a channel in this server.`")
        .then(steps.askChannel)
        .then(steps.saveChannel)
        .then(steps.askDuration)
        .then(steps.saveTime)
        .then(steps.askPrize)
        .then(steps.savePrize)
        .then(steps.askNumberOfPrizes)
        .then(steps.saveNumberOfPrizes)
        .then(steps.askRoleExtraValue)
        .then(steps.saveRoleExtraValue)
        .then(()=>message.channel.send(`Done! the giveaway is starting in ${steps.getChannel()} and time ${steps.getTime()}`))
        .then(steps.startGiveaway)
        .then(steps.giveResults)
        .catch(steps.handleErrors)
        .catch(error => console.log(error));
    },
};


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
