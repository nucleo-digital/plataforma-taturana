if (Meteor.isClient) {

  Template.registerHelper("isEqual", function (arg1, arg2) {
      return arg1 === arg2;
  });

  Template.registerHelper("isAdmin", function () {
    return Meteor.user().profile.roles.indexOf('admin') > -1;
  });

  Template.registerHelper('categories', function() {
    return _.map(CATEGORIES, function(item) { return {name: item}; });
  });

  Template.registerHelper('subcategories', function() {
    return _.map(SUBCATEGORIES, function(item) { return {name: item}; });;
  });

  Template.registerHelper('ufs', function() {
    return ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
             'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
             'RO', 'RS', 'RR', 'SC', 'SE', 'SP', 'TO']
  });

}

