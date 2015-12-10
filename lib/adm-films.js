if (Meteor.isClient) {

  Template.admFilms.helpers({
    films: function () {
      return Films.find({});
    }
  });

  Template.admFilms.events({
    "submit .new-film": function (event) {
      var poster_path = Session.get("poster_path");
      var press_kit_path = Session.get("press_kit_path");
      
      event.preventDefault();
      console.log(event);
      var status = event.target.status.value;
      var title = event.target.title.value;
      var title_pt = event.target.title_pt.value;
      var synopsis = event.target.synopsis.value;
      var trailer_url = event.target.trailer_url.value;
      var genre = event.target.genre.value;
      var year = event.target.year.value;
      var length = event.target.length.value;
      var country = event.target.country.value;
      var distributor = event.target.distributor.value;
      var technical_information = event.target.technical_information.value;

      Films.insert({
        status: status,
        title: title,
        title_pt: title_pt,
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
    },
    "click .destroy": function () {
      Films.remove(this._id);
    }
  });
}


