if (Meteor.isClient) {
  Meteor.subscribe("ambassadors");

  Template.admAmbassadors.helpers({
    ambassadors: function () {
      return filteredAmbassadors();
    },

    films: function () {
      return Films.all();
    },

    firstAddress: function (emails) {
      return emails[0].address;
    },
    get_place_data: function (data_type) {
      var place_data = [],
        ambassadors = Meteor.users.find({}, {
          fields: {
            'profile.city': 1,
            'profile.uf': 1
          }
        }).fetch();
      _.each(ambassadors, function (ambassador) {
        if (ambassador.profile) {
          place_data.push(ambassador.profile[data_type]);
        }
      });
      return _.uniq(place_data).sort();
    }
  });

  Template.admAmbassadors.events({
    "submit #ambassadors-filters": function (event) {

      event.preventDefault();
      var el = event.target;

      var filters = {
        noScreenings: el.noScreenings.checked,
        pendingReport: el.pendingReport.checked,
        teamMember: el.teamMember.checked,
      };

      if (hasValue(el.category)) {
        filters['profile.category'] = el.category.value;
      }
      if (hasValue(el.subcategory)) {
        filters['profile.subcategory'] = el.subcategory.value;
      }
      if (hasValue(el.filmDisplayed)) {
        filters['filmDisplayed'] = el.filmDisplayed.value;
      }
      if (hasValue(el.city)) {
        filters['profile.city'] = el.city.value;
      }
      if (hasValue(el.uf)) {
        filters['profile.uf'] = el.uf.value;
      }

      Session.set('ambassadorsFilters', filters);
    },

    "click .csv-export": function (event) {
      event.preventDefault();
      var data = filteredAmbassadors().map(function (u) {
        var d = new Date(u.createdAt);

        return {
          'data de criação': d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear(),
          'hora da criação': d.getHours() + ':' + d.getMinutes(),
          'nome': u.profile.name,
          'email': u.emails[0].address,
          'telefone fixo': u.profile.phone,
          'telefone celular': u.profile.cell_phone,
          'instituição': u.profile.institution,
          'área': u.profile.category,
          'temática': u.profile.subcategory,
          'uf': u.profile.uf,
          'city': u.profile.city,
          'id': u._id
        }
      });
      var csv = Papa.unparse(data);
      window.open(encodeURI('data:text/csv;charset=utf-8,' + csv));
    }
  });

  var hasValue = function (prop) {
    return prop !== undefined && _.trim(prop.value).length > 0;
  };

  var filteredAmbassadors = function () {
    var filters = Session.get('ambassadorsFilters') || {};
    var findAttrs = _.pick(filters, ['profile.category', 'profile.subcategory', 'profile.city', 'profile.uf']);

    users = Meteor.users.find(findAttrs).fetch();

    if (filters['noScreenings']) {
      users = _.filter(users, function (user) {
        return Films.find({
          "screening.user_id": user._id
        }).count() == 0;
      });
    }

    if (filters['pendingReport']) {
      // TODO
      console.log('IMPLEMENT pendingReport');
    }

    if (filters['teamMember']) {
      users = _.filter(users, function (user) {
        return Films.find({
          'screening.user_id': user._id,
          'screening.team_member': true
        }).count() > 0;
      });
    }

    if (filters['filmDisplayed']) {
      users = _.filter(users, function (user) {
        var titles = Films.find({
          "screening.user_id": user._id
        }).fetch().map(function (film) {
          return film.title
        });
        return titles.indexOf(filters['filmDisplayed']) > -1;
      });
    }
    return users;
  };
}
