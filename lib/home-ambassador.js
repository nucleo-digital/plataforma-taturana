if (Meteor.isClient) {
  Template.ambassador.helpers({
    disseminate: function() {
      return Films.disseminate();
    }
  });
  Template.ambassador.events({
    "click .destroy": function () {
      Meteor.call('removeScreening', this._id);
    }
  });
}
