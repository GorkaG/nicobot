module.exports = {
    name: 'invite',
    description: 'Invite Nico to your server',
    isAdminCommand: false,
    execute(message, args) {
        message.channel.sendMessage('Link del bot Test: <Secret> Link del bot Oficial: <Secret>');
    },
};
