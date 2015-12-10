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

  var name = "admin"
  var email = "admin@plataforma.taturana.com.br"
  var password = "12345678";

  if(Meteor.users.find({'emails.address':email}).count()===0){
      console.log("Creating user admin");
      Accounts.createUser({
        email: email,
        password: password,
        profile : {
          roles:['admin'],
          name: name
        }
      });
  }

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

