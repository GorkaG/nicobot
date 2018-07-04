const db = require('../models');


module.exports = {
    name: 'imagelock',
    description: 'Filter the usage of images in the used channel, parameters: enable || disable',
    async execute(message, args) {
        const guild = message.channel.guild;
        const guildMember = await guild.fetchMember(message.author);
        if(!guildMember.hasPermission("ADMINISTRATOR")){
            message.reply("you need administration permissions");
            return;
        }
        let enable = args[0];
        if (enable === undefined || !(enable === 'enable' || enable === 'disable')) {
            message.channel.sendMessage("You must provide if the image lock is enabled or disabled");
            return;
        }
        let channel = message.mentions.channels.first();
        if (channel === undefined) {
            channel = message.channel;
        }
        let enabled = enable === 'enable' ? true : false;
        let lockImage = {
            channelId: channel.id,
            locked: enabled
        };
        try {
            let lockImageReturned = await db.LockImageSchema.findOne({ channelId: channel.id })
            if (lockImageReturned === undefined || lockImageReturned === null) {
                await db.LockImageSchema.create(lockImage);
            }
            else {
                await db.LockImageSchema.findOneAndUpdate({ _id: lockImageReturned._id }, lockImage, { new: true })
            }
            let response = "`";
            if (enabled) {
                response += "Filter mode activated";
            }
            else {
                response += "Filter mode desactivated";
            }
            response += " at channel `" + channel;
            message.channel.send(response);
        } catch (error) {
            console.error(error);
            message.channel.send("An error ocurred");
        }
    },
};