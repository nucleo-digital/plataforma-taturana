if (Meteor.isClient) {
  Meteor.subscribe("ambassadors");

  Template.admAmbassadors.helpers({
    ambassadors: function() {
      return Meteor.users.find({}).fetch();
    },
  });

}
