if (Meteor.isClient) {
  Template.registerHelper("isEqual", function (arg1, arg2) {
      return arg1 === arg2;
  });
}
