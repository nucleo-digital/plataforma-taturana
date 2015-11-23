Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/uploads/tmp',
    uploadDir: process.env.PWD + '/uploads/',
    checkCreateDirectories: true,
    getDirectory: function(fileInfo, formData) {
      return formData.contentType;
      console.log("formData");
      console.log(formData);
    },
    finished: function(fileInfo, formFields) {
      console.log("fileInfo");
      console.log(fileInfo);
    },
    cacheTime: 100,
    mimeTypes: {
      "xml": "application/xml",
      "vcf": "text/x-vcard"
    }
  });
});