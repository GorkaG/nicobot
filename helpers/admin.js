const Discord = require('discord.js');
exports.isAdmin = (guild,user)=> {
    const fetchAuthorGuildMember = guild.fetchMember(user);
        return isAdminQuery = fetchAuthorGuildMember
            .then(authorGuildMember => {
                return authorGuildMember.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)
            });
}