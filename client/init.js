Meteor.startup(function() {
  require(['chartist-plugin-legend']);

  Uploader.finished = function(index, fileInfo, body) {
    var f_type = body.data.formData.file_type;
    Session.set(f_type, fileInfo.path);
  }

  FlashMessages.configure({
    autoHide: true,
    hideDelay: 4000,
    autoScroll: true
  });
})
