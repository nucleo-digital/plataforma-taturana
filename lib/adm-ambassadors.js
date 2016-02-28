if (Meteor.isClient) {
  Meteor.subscribe("ambassadors");

  Template.admAmbassadors.helpers({
    ambassadors: function() {
      var filters = Session.get('ambassadorsFilters') || {};

      var findAttrs = _.pick(filters, ['profile.category', 'profile.subcategory']);
      users =  Meteor.users.find(findAttrs).fetch();

      if (filters['noScreenings']) {
        users = _.filter(users, function(user) {
          return Films.find({"screening.user_id": user._id}).count() == 0;
        });
      }

      if (filters['pendingReport']) {
        // TODO
        console.log('IMPLEMENT pendingReport');
      }

      if (filters['filmDisplayed']) {
        // TODO
        console.log('IMPLEMENT filmDisplayed');
      }

      return users
    },

    films: function () {
      return Films.all();
    },

    firstAddress: function(emails) {
      return emails[0].address;
    },
  });

  Template.admAmbassadors.events({
    "submit #ambassadors-filters": function (event) {
      event.preventDefault();
      var el = event.target;

      var filters = {
        noScreenings:  el.noScreenings.checked,
        pendingReport: el.pendingReport.checked,
      };

      if (hasValue(el.category))    { filters['profile.category']    = el.category.value; }
      if (hasValue(el.subcategory)) { filters['profile.subcategory'] = el.subcategory.value; }

      Session.set('ambassadorsFilters', filters);
    },
  });

  var hasValue = function(prop) {
    return prop !== undefined && _.trim(prop.value).length > 0;
  };
}
