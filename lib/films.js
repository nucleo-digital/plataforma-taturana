if (Meteor.isClient) {

  Template.films.helpers({
    films: function () {
      return Films.find({});
    }
  });

}

