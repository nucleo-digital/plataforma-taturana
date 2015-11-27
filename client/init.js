Meteor.startup(function() {
  Uploader.finished = function(index, fileInfo, body) {
    if (fileInfo.subDirectory == 'file') {
      Session.set("press_kit_path", fileInfo.path);
    } else {
      Session.set("poster_path", fileInfo.path);
    } 
  }
})