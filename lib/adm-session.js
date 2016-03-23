
if (Meteor.isClient) {
  Template.admSession.helpers({
    user: function(userId) {
      return Meteor.users.findOne({_id: userId});
    },
  });
}
