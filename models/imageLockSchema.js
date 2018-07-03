//name, completed , created_date

var mongoose = require('mongoose');

var imageLockSchema = new mongoose.Schema({
    channelId:{
        type:String,
        required: 'ChannelId cannot be blank'
    },
    locked:{
        type: Boolean,
        default: true
    },
    last_updated:{
        type: Date,
        default: Date.now
    }
});
const IMAGE_LOCK_SCHEMA = 'imageLockSchema';
var ImageLock = mongoose.model('imageLockSchema',imageLockSchema);

module.exports = ImageLock;