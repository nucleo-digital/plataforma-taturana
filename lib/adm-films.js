if (Meteor.isClient) {

  Template.admFilms.helpers({
    films: function () {
      return Films.all();
    },
    posterData: function() {
      return {
        file_type: 'poster-'
      }
    },
    posterThumbData: function() {
      return {
        file_type: 'poster_thumb-'
      }
    }, 
    posterSliceData: function() {
      return {
        file_type: 'poster_slice-'
      }
    },
    pressKitData: function() {
      return {
        file_type: 'press_kit-'
      }
    }
  });

  Template.admFilms.events({
    "submit .new-film": function (event) {
      var poster_path = Session.get("poster_path");
      var poster_slice_path = Session.get("poster_slice_path");
      var poster_thumb_path = Session.get("poster_thumb_path");
      var press_kit_path = Session.get("press_kit_path");
      
      event.preventDefault();
      console.log(event);
      var id = event.target.id.value;
      var sequence_number = event.target.sequence_number.value;
      var status = event.target.status.value;
      var title = event.target.title.value;
      var synopsis = event.target.synopsis.value;
      var trailer_url = event.target.trailer_url.value;
      var genre = event.target.genre.value;
      var year = event.target.year.value;
      var length = event.target.length.value;
      var country = event.target.country.value;
      var age_rating = event.target.age_rating.value;
      var distributor = event.target.distributor.value;
      var director = event.target.director.value;
      var technical_information = event.target.technical_information.value;
      var site = event.target.site.value;
      var facebook = event.target.facebook.value;
      var twitter = event.target.twitter.value;
      var instagram = event.target.instagram.value;
      var youtube = event.target.youtube.value;

      Meteor.call('updateOrCreateFilm', {
        id: id,
        sequence_number: sequence_number,
        status: status,
        title: title,
        synopsis: synopsis,
        poster_path: poster_path,
        poster_slice_path: poster_slice_path,
        poster_thumb_path: poster_thumb_path,
        trailer_url: trailer_url,
        press_kit_path: press_kit_path,
        genre: genre,
        year: year,
        length: length,
        country: country,
        age_rating: age_rating,
        director: director,
        distributor: distributor,
        technical_information:technical_information,
        site: site,
        facebook: facebook,
        twitter: twitter,
        instagram: instagram,
        youtube: youtube,
        createdAt: new Date()
      });
      
      event.target.reset();
      Router.go("adm-films");    
    },
    "click .destroy": function () {
      Meteor.call('removeFilm', this._id);
    },
    "click .destroy-img": function (event) {
      console.log(event.target.src);
      console.log(this);
    }
  });
}


