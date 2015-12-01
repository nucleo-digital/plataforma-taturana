Films = new Mongo.Collection("films");

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
      var director = event.target.director.value;
      var producer = event.target.producer.value;
      var coproducer = event.target.coproducer.value;
      var associate_producer = event.target.associate_producer.value;
      var executive_producer = event.target.executive_producer.value;
      var soundtrack = event.target.soundtrack.value;
      var editor = event.target.editor.value;

      Films.insert({
        status: status,
        title: title,
        title_pt: title_pt,
        poster_path: poster_path,
        trailer_url: trailer_url,
        press_kit_path: press_kit_path,
        genre: genre,
        year: year,
        length: length,
        country: country,
        distributor: distributor,
        editor: editor,
        producer: producer,
        coproducer: coproducer,
        associate_producer: associate_producer,
        executive_producer: executive_producer,
        soundtrack: soundtrack,
        createdAt: new Date()
      });
 
      event.target.reset();     
    },
    "click .destroy": function () {
      Films.remove(this._id);
    }
  });
}


