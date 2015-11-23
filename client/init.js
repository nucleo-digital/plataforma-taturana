Meteor.startup(function() {
  Uploader.finished = function(index, fileInfo, body) {
    console.log(fileInfo);
    if (fileInfo.subDirectory == 'file') {
      Session.set("press_kit_url", fileInfo.url);
    } else {
      Session.set("poster_url", fileInfo.url);
    } 
  }
})