if (Meteor.isClient) {

  Template.admFilms.helpers({
    films: function () {
      return Films.all();
    },
    posterData: function() {
      return { file_type: 'poster_path' }
    },
    posterThumbData: function() {
      return { file_type: 'poster_thumb_path' }
    }, 
    posterSliceData: function() {
      return { file_type: 'poster_slice_path' }
    },
    pressKitData: function() {
      return { file_type: 'press_kit_path' }
    }
  });

  Template.admFilms.events({
    "submit .new-film": function (event) {
      event.preventDefault();

      var poster = (event.target.poster_path == undefined) ? Session.get('poster_path') : event.target.poster_path.value;
      var poster_slice = (event.target.poster_slice_path == undefined) ? Session.get('poster_slice_path') : event.target.poster_slice_path.value;
      var poster_thumb = (event.target.poster_thumb_path == undefined) ? Session.get('poster_thumb_path') : event.target.poster_thumb_path.value;
      var press_kit = (event.target.press_kit_path == undefined) ? Session.get('press_kit_path') : event.target.press_kit_path.value;

      var film = {
        poster_path: poster,
        poster_slice_path: poster_slice,
        poster_thumb_path: poster_thumb,
        press_kit_path: press_kit,
        id: event.target.id.value,
        sequence_number: event.target.sequence_number.value,
        status: event.target.status.value,
        title: event.target.title.value,
        synopsis: event.target.synopsis.value,
        trailer_url: event.target.trailer_url.value,
        genre: event.target.genre.value,
        year: event.target.year.value,
        length: event.target.length.value,
        country: event.target.country.value,
        age_rating: event.target.age_rating.value,
        production_company: event.target.production_company.value,
        director: event.target.director.value,
        technical_information: event.target.technical_information.value,
        site: event.target.site.value,
        facebook: event.target.facebook.value,
        twitter: event.target.twitter.value,
        instagram: event.target.instagram.value,
        youtube: event.target.youtube.value,
        createdAt: new Date()
      }

      Meteor.call('updateOrCreateFilm', film);
      
      event.target.reset();
      Router.go("adm-films");    
    },
    "click .destroy": function () {
      Meteor.call('removeFilm', this._id);
    },
    "click .destroy-img": function (event) {
      console.log(event.target.src);
    }
  });
}


