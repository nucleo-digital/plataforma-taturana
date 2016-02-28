if (Meteor.isClient) {
  Meteor.subscribe("ambassadors");

  Template.admAmbassadors.helpers({
    ambassadors: function() {
      var filters = Session.get('ambassadorsFilters') || {};
      console.log("FILTERS", filters);
      return Meteor.users.find(filters).fetch();
    },

    firstAddress: function(emails) {
      return emails[0].address;
    },
  });

  Template.admAmbassadors.events({
    "submit #ambassadors-filters": function (event) {
      event.preventDefault();
      var el = event.target;

      var filters = {};
      if (hasValue(el.category))    { filters['profile.category']    = el.category.value; }
      if (hasValue(el.subcategory)) { filters['profile.subcategory'] = el.subcategory.value; }

      Session.set('ambassadorsFilters', filters);
    },
  });

  var hasValue = function(prop) {
    return prop !== undefined && _.trim(prop.value).length > 0;
  };
}
