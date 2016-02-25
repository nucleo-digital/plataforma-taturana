Meteor.startup(function() {
  Uploader.finished = function(index, fileInfo, body) {
    var f_type = body.data.formData.file_type;
    
    // if(f_type === 'poster-'){
    //   console.log("entrou 1");
    //   Session.set('poster_path', fileInfo.path);
    // } else if(f_type === 'poster_slice-'){
    //   console.log("entrou 2");
    //   Session.set('poster_slice_path', fileInfo.path);
    // } else if(f_type === 'poster_thumb-'){
    //   console.log("entrou 3");
    //   Session.set('poster_thumb_path', fileInfo.path);
    // } else if(f_type === 'press_kit_path-'){
    //   console.log("entrou 4");
    //   Session.set('press_kit_path', fileInfo.path);
    // }
    Session.set(f_type, fileInfo.path);
  }
})