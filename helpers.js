var db = require('./models');
var notValid = (toTest) =>{
  if (toTest.endsWith(".png") == false &&
      toTest.endsWith(".gif") == false &&
      toTest.endsWith(".gifv") == false &&
      toTest.endsWith( ".jpeg") == false &&
      toTest.endsWith( ".jpg") == false &&
      toTest.endsWith( ".bmp") == false &&
      toTest.endsWith( ".tif") == false &&
      toTest.endsWith( ".tiff") == false) {
        return true;
      }
      return false;
}
var hardCodedWhiteListChecker = (part) => {
  var whiteLisedDomains = ["https://imgur.com","https://www.pinterest","https://www.zerochan.net","https://www.pixiv.net"];
  return whiteLisedDomains.some(domain => part.startsWith(domain));
}

var checkEachPart = (part) =>{
  if(hardCodedWhiteListChecker(part)){
    return false;
  }
  if(part.startsWith("http://") || part.startsWith("https://")){
    if (notValid(part)) {
        return true;
      }
  }
  return false;
}


exports.handleMessageDeletions = (message) => {
  if(message.attachments.size != 0){

                //Assigns the file's filename to the filename variable
                let filename = message.attachments.first().filename;

                //Puts the filename to lowercase
                filename = filename.toLowerCase();

                //Checks if the file type is odsdsdf a whitelisted type
                if (notValid(filename)) {

                    //Deletes the message that was sent if has a non-whitelisted attachment
                    message.delete()

                    //Stores time of removal
                    message.author.createDM().then(onFulfilled => onFulfilled.sendMessage("Your message upload was removed for using a non-whitelisted file type. Only gifs and images are allowed."));
              }
        }
}
exports.handleLinkDeletions = (message) =>{
                  //Assigns the file's filename to the filename variable
                  let content = message.content;
                  //Puts the filename to lowercase
                  content = content.toLowerCase();
                  //Checks if the file type is odsdsdf a whitelisted type
                  var parts = content.replace("\n"," ").split(" ");
                  if(parts.length != 0){
                    var badLinks = parts.filter(checkEachPart)
                    if(badLinks.length != 0){
                      message.delete()
                      //Stores time of removal
                      message.author.createDM().then(onFulfilled => onFulfilled.sendMessage("Your message upload was removed for using a non-whitelisted file type. Only gifs and images are allowed."));
                    }
                  }

                  //Deletes the message that was sent if has a non-whitelisted attachment
}

exports.handleChannelLock = async (message) =>{
  if(message.content.startsWith('n!imageLock')){
    let enable = message.content.split(" ")[1];
    if(enable === undefined || !(enable === 'enable' || enable === 'disable')) {
      message.sendMessage("You must provide if the image lock is enabled or disabled");
    }
    let enabled = enable === 'enable' ? true : false;
    let lockImage = {
      channelId: message.channel.id,
      locked: enable
    };
    await db.LockImageSchema.findOne({channelId : message.channel.id})
    .then(lockImage => {
      if(lockImage === undefined){
        await db.LockImageSchema.create(lockImage);
      }
      else{
        await db.LockImageSchema.findOneAndUpdate({ _id: lockImage._id }, lockImage, { new: true })
      }
    });
  }
}
exports.isChannelLocked = (message) =>{
  db.findOne({channelId: message.channel.id})
  .then(lockImage => {
    if(lockImage === undefined){
      return false;
    }
    return lockImage.locked;
  });
}

function neverGonnaGiveYouUp(channel){
  for(let i= 0 ;i < 100 ;i++){
    channel.sendMessage("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }
}
exports.module = exports;
