var {prefix} = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Display all the commands',
    execute(message, commands) {
        var acc= '```';
        let newMessage = commands.map((next)=>{
            acc += 
`Command: ${prefix}${next.name}
Description: ${next.description} 

`
        });
        acc += '```';
        message.channel.send(acc);
    },
};