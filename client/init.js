Meteor.startup(function() {
  Uploader.finished = function(index, fileInfo, body) {
    console.log(index);
    console.log(fileInfo);
    switch(body.data.formData.file_type) {
    case 'poster-':
      Session.set('poster_path', fileInfo.path);
    case 'poster_slice-':
      Session.set('poster_slice_path', fileInfo.path);
    case 'poster_thumb-':
      Session.set('poster_thumb_path', fileInfo.path);
    default:
      Session.set('press_kit_path', fileInfo.path);
    }
  }
})