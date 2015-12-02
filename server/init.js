Meteor.methods({
  sendEmail: function (text) {
    this.unblock();
    Email.send({
      to: '',
      from: '',
      subject: '',
      text: text
    });
  }
});
Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/uploads/tmp',
    uploadDir: process.env.PWD + '/uploads/',
    checkCreateDirectories: true,
    getDirectory: function(fileInfo, formData) {
      return formData.contentType;
    },
    finished: function(fileInfo, formFields) {
    },
    cacheTime: 100,
    mimeTypes: {
      "xml": "application/xml",
      "vcf": "text/x-vcard"
    }
  });
});

