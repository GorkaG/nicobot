var {prefix} = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Display all the commands',
    isAdminCommand: false,
    execute(message, commands) {
        var acc= '```';
        let newMessage = commands.filter(command => !command.isAdminCommand)
        .map((next)=>{
            acc += 
`Command: ${prefix}${next.name}
Description: ${next.description} 

`
        });
        acc += '```';
        message.channel.send(acc);
    },
};