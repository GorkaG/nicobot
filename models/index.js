var mongoose = require('mongoose');
mongoose.set('debug',true);
mongoose.connect(process.env.MONGO_URL_CONNECTION);

mongoose.Promise = Promise;


module.exports.LockImageSchema = require("./imageLockSchema");