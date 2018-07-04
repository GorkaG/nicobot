let db = require('../models');


module.exports = {
    name: 'imagelock',
    description: 'Filter the usage of images in the used channel, parameters: enable || disable',
    async execute(message, args) {
       
        let enable = args[0];
        if (enable === undefined || !(enable === 'enable' || enable === 'disable')) {
            message.channel.sendMessage("You must provide if the image lock is enabled or disabled");
            return;
        }
        let enabled = enable === 'enable' ? true : false;
        let lockImage = {
            channelId: message.channel.id,
            locked: enabled
        };
        try {
            let lockImageReturned = await db.LockImageSchema.findOne({ channelId: message.channel.id })
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
            response += ` at channel #${message.channel.name}`
            response += '`';
            message.channel.send(response);
        } catch (error) {
            console.error(error);
            message.channel.send("An error ocurred");
        }
    },
};