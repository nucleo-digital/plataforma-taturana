if (Meteor.isClient) {
  Template.ambassador.helpers({
    disseminates: function() {
      return Films.disseminates();
    }
  });
}
