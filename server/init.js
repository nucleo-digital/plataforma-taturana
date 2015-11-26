Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/public/uploads/tmp',
    uploadDir: process.env.PWD + '/public/uploads/',
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