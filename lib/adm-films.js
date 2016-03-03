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

      var el = event.target;

      var poster = (el.poster_path == undefined) ? Session.get('poster_path') : el.poster_path.value;
      var poster_slice = (el.poster_slice_path == undefined) ? Session.get('poster_slice_path') : el.poster_slice_path.value;
      var poster_thumb = (el.poster_thumb_path == undefined) ? Session.get('poster_thumb_path') : el.poster_thumb_path.value;
      var press_kit = (el.press_kit_path == undefined) ? Session.get('press_kit_path') : el.press_kit_path.value;

      var film = {
        poster_path: poster,
        poster_slice_path: poster_slice,
        poster_thumb_path: poster_thumb,
        press_kit_path: press_kit,
        id: el.id.value,
        sequence_number: parseInt(el.sequence_number.value || (Films.count() + 1), 10),
        status: el.status.value,
        title: el.title.value,
        synopsis: el.synopsis.value,
        trailer_url: el.trailer_url.value,
        genre: el.genre.value,
        year: el.year.value,
        length: el.length.value,
        country: el.country.value,
        age_rating: el.age_rating.value,
        production_company: el.production_company.value,
        director: el.director.value,
        technical_information: el.technical_information.value,
        site: el.site.value,
        facebook: el.facebook.value,
        twitter: el.twitter.value,
        instagram: el.instagram.value,
        youtube: el.youtube.value,
        createdAt: new Date()
      }

      Meteor.call('updateOrCreateFilm', film);

      event.target.reset();
      FlashMessages.sendSuccess("Filme cadastrado com sucesso!");
      Router.go("adm/films");
    },
    "click .destroy": function () {
      if (window.confirm('Deseja realmente excluir o filme "' + this.title + '" ?')) {
        Meteor.call('removeFilm', this._id);
      }
    },
    "click .destroy-img": function (event) {
      console.log(event.target.src);
    }
  });
}
