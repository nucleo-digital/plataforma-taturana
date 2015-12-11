if (Meteor.isClient) {

  Template.admFilms.helpers({
    films: function () {
      return Films.all();
    }
  });

  Template.admFilms.events({
    "submit .new-film": function (event) {
      var poster_path = Session.get("poster_path");
      var press_kit_path = Session.get("press_kit_path");
      
      event.preventDefault();
      console.log(event);
      var id = event.target.id.value;
      var status = event.target.status.value;
      var title = event.target.title.value;
      var synopsis = event.target.synopsis.value;
      var trailer_url = event.target.trailer_url.value;
      var genre = event.target.genre.value;
      var year = event.target.year.value;
      var length = event.target.length.value;
      var country = event.target.country.value;
      var distributor = event.target.distributor.value;
      var technical_information = event.target.technical_information.value;

      Meteor.call('updateOrCreateFilm', {
        id: id,
        status: status,
        title: title,
        synopsis: synopsis,
        poster_path: poster_path,
        trailer_url: trailer_url,
        press_kit_path: press_kit_path,
        genre: genre,
        year: year,
        length: length,
        country: country,
        distributor: distributor,
        technical_information:technical_information,
        createdAt: new Date()
      });
      
      event.target.reset();
      Router.go("adm-films");    
    },
    "click .destroy": function () {
      Meteor.call('removeFilm', this._id);
      //Films.remove(this._id);
    }
  });
}


