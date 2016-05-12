Meteor.methods({
  sendEmail: function (pidgeon) {
    this.unblock();
    Email.send({
      to: pidgeon.to,
      from: pidgeon.from,
      subject: pidgeon.subject,
      text: pidgeon.content
    });
  },

  updateOrCreateFilm: function (film) {
    var f_id = film.id;
    delete film.id;

    if (f_id === undefined || f_id === '') {
      Films.insert(film);
    } else {
      Films.update(f_id, {
        $set: {
          sequence_number: film.sequence_number,
          status: film.status,
          title: film.title,
          synopsis: film.synopsis,
          poster_path: film.poster_path,
          poster_thumb_path: film.poster_thumb_path,
          poster_home_path: film.poster_home_path,
          trailer_url: film.trailer_url,
          press_kit_path: film.press_kit_path,
          genre: film.genre,
          year: film.year,
          length: film.length,
          country: film.country,
          age_rating: film.age_rating,
          director: film.director,
          production_company: film.production_company,
          technical_information: film.technical_information,
          site: film.site,
          facebook: film.facebook,
          twitter: film.twitter,
          instagram: film.instagram,
          youtube: film.youtube
        }
      });
    }
  },
  removeFilm: function (id) {
    Films.remove(id);
  },
  addToSlideshow: function(id, image) {
    Films.update(id, {$push: {slideshow: image}});
  },
  removeFromSlideshow: function (id, src) {
    var image = Films.get_image_by_src(id, src);
    Films.update(id, {$pull: {slideshow: image}});
  },
  addScreening: function(film_id, new_screening){
    Films.update(film_id, {$push: {screening: new_screening}});
    return new_screening._id;
  },
  updateScreening: function(f_screening){
    var film = Films.by_screening_id(f_screening._id),
        screenings = film["screening"];

    for (i = 0; i < screenings.length; i++) {
      if (screenings[i]._id == f_screening._id) {
        screenings.splice(i,1,f_screening);
      }
    }
    Films.update({_id: film._id}, {$set: { screening: screenings }});
  },
  setScreeningDraftStatus: function(id, status) {
    var film = Films.by_screening_id(id),
        screenings = film["screening"];

    _.each(screenings, function(screening, i) {
      if (screening._id == id) {
        screenings[i].draft = status;
      }
    })

    Films.update({_id: film._id}, {$set: { screening: screenings }});
  },
  removeScreening: function (screening_id) {
    var film = Films.by_screening_id(screening_id);
    var f_screening = Films.return_screening(screening_id);
    Films.update({_id: film._id}, {$pull: {screening: f_screening}});
  },
  addAddress: function(user_id, new_address){
    Meteor.users.update(user_id, {$push: {addresses: new_address}});
  },
  removeAddress: function(user_id, address){
    Meteor.users.update(user_id, {$pull: {addresses: address}});
  },
  updateUser:function(profile, email){
    user = Meteor.user();

    // Mantem o role do usuário
    profile.roles = user.profile.roles || ['ambassador'];

    Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile": profile}});
    Meteor.users.update({_id: Meteor.userId()}, {$set: {'emails.0.address': email}});
  }
});

Meteor.startup(function () {

  Meteor.publish("films",function(){
    return Films.find({});
  });

  Meteor.publish("ambassadors", function () {
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, addresses: 1 }});
  });

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
    getFileName: function(fileInfo, formData) {
      var name = fileInfo.name.replace(/\s/g, '');
      return formData.file_type + name;
    },
    finished: function(fileInfo, formFields) {
    },
    cacheTime: 100,
    mimeTypes: {
      "xml": "application/xml",
      "vcf": "text/x-vcard"
    }
  });

  // Forgot Password Email
  Accounts.emailTemplates.siteName = "Taturana Mobilização Social";
  Accounts.emailTemplates.from = "Taturana<admin@plataforma.taturana.com.br>";
  Accounts.emailTemplates.resetPassword.subject = function (user) {
      return "[Taturana] Esqueci minha senha";
  };
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
     return "Olá,\n\n"
       + " Para resetar sua senha, acesse o link abaixo:\n"
       + url;
  };

  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };


  // Creating Slugs in Bulk for Existing Films
  var count, docs;

  docs = Films.find({
    slug: {
      $exists: false
    }
  }, {
    limit: 50
  });

  count = 0;

  docs.forEach(function(doc) {
    Films.update({
      _id: doc._id
    }, {
      $set: {
        fake: ''
      }
    });
    return count += 1;
  });
  return console.log('Update slugs for ' + count + ' Films.');


});
