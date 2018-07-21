var {prefix} = require('../config.json');

module.exports = {
    name: 'adminhelp',
    description: 'Display all the admin commands',
    isAdminCommand: true,
    execute(message, commands) {

        var acc= '```';
        let newMessage = commands.filter(command => command.isAdminCommand)
        .map((next)=>{
            acc += 
`Command: ${prefix}${next.name}
Description: ${next.description} 

`
        });
        acc += '```';
        message.author.createDM().then(dmChannel => dmChannel.send(acc));
    },
};