if (Meteor.isClient) {
  Template.registerHelper("isEqual", function (arg1, arg2) {
      return arg1 === arg2;
  });

  Template.registerHelper("isAdmin", function () {
    return Meteor.user().profile.roles.indexOf('admin') > -1;
  });
}
