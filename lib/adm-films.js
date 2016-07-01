if (Meteor.isClient) {

  Template.admFilms.rendered = function() {
    $('#synopsis').summernote();
    if (this.data.synopsis !== null){
      $('#synopsis').summernote('code', this.data.synopsis);
    }
    
  }

  Template.admFilms.helpers({
    films: function () {
      return Films.all();
    },
    posterData: function() {
      return { file_type: 'poster_path' }
    },
    pressKitData: function() {
      return { file_type: 'press_kit_path' }
    },
    posterHomeData: function() {
      console.log("entra!");
      return { file_type: 'poster_home_path' }
    },
    posterPath: function() {
      if (!Session.get('poster_path') && this.poster_path) {
        Session.set('poster_path', this.poster_path);
      }

      return Session.get('poster_path');
    },
    homePath: function() {
      if (!Session.get('poster_home_path') && this.poster_home_path) {
        Session.set('poster_home_path', this.poster_home_path);
      }

      return Session.get('poster_home_path');
    }
  });

  Template.admFilms.events({
    "submit .new-film": function (event) {
      event.preventDefault();

      var el = event.target;
      var synopsis = $('#synopsis').summernote('code');
      console.log(el.poster_home_path.value);
      console.log("session:" + Session.get('poster_home_path'));

      var poster = (el.poster_path == undefined) ? Session.get('poster_path') : el.poster_path.value;
      var press_kit = (el.press_kit_path == undefined) ? Session.get('press_kit_path') : el.press_kit_path.value;
      var poster_home = (el.poster_home_path == undefined) ? Session.get('poster_home_path') : el.poster_home_path.value;
      
      var film = {
        poster_path: poster,
        press_kit_path: press_kit,
        poster_home_path: poster_home,
        id: el.id.value,
        sequence_number: parseInt(el.sequence_number.value || (Films.count() + 1), 10),
        status: el.status.value,
        title: el.title.value,
        synopsis: synopsis,
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
      console.log(film);

      Meteor.call('updateOrCreateFilm', film);

      event.target.reset();
      FlashMessages.sendSuccess("Filme cadastrado com sucesso!");
      Session.set('poster_path', null);
      Session.set('poster_home_path', null);
      Router.go("adm/films");
    },
    "click .destroy": function () {
      if (window.confirm('Deseja realmente excluir o filme "' + this.title + '" ?')) {
        Meteor.call('removeFilm', this._id);
      }
    },
    "click .destroy-img": function (event) {
      console.log(event.target.src);
    },
    "click .btn-change-poster": function(e) {
      e.preventDefault();

      this.poster_path = null;
      Session.set('poster_path', null);
    },
    "click .btn-change-home": function(e) {
      e.preventDefault();

      this.poster_home_path = null;
      Session.set('poster_home_path', null);
    }
  });
}
