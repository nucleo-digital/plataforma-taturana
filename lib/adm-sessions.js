
if (Meteor.isClient) {
  Template.admSessions.helpers({
    films: function() {
      return Films.all().fetch();
    },
    ambassador_options: function(films) {
      var ambassadorsIds = [],
          ambassadors = [];

      _.each(films, function(film) {
        _.each(film.screening, function(screening) {
          if (screening.user_id) {
            ambassadorsIds.push(screening.user_id);
          }
        });

        ambassadorsIds = _.uniq(ambassadorsIds);

        ambassadors = Meteor.users.find({_id: { $in: ambassadorsIds}}).fetch();
      });

      return _.uniq(ambassadors);
    },
    states_options: function(films) {
      var states = [];

      _.each(films, function(film) {
        _.each(film.screening, function(screening) {
          if (screening.uf) {
            states.push(screening.uf);
          }
        });
      });

      return _.uniq(states);
    },
    cities_options: function(films) {
      var cities = [];

      _.each(films, function(film) {
        _.each(film.screening, function(screening) {
          if (screening.city) {
            cities.push(screening.city);
          }
        });
      });

      return _.uniq(cities);
    },
    filtered_films: function() {
      // filmes obedecendo filtros
      var films = Films.all().fetch(),
          screenings,
          future_screenings = [],
          filtered_films = [];

      _.each(films, function(film) {
        screenings = film.screening || [];

        if (!screenings) return;

        _.each(screenings, function(screening) {
            // applica filtros
            var filtered_city = Session.get('city'),
                filtered_state = Session.get('state'),
                filtered_month = Session.get('month'),
                filtered_title = Session.get('title'),
                filtered_ambassador = Session.get('ambassador');

            if ((!filtered_city || screening['city'] == filtered_city) &&
              (!filtered_state || screening['state'] == filtered_state) &&
              (!filtered_ambassador || screening['user_id'] == filtered_ambassador) &&
              (!filtered_month || screening['date'].getMonth() == filtered_month) &&
              (!filtered_title || screening['title'] == filtered_title)) {
              future_screenings.push(screening);
            }
        })

        if (future_screenings.length > 0) {
          film.future_screenings = future_screenings;
          filtered_films.push(film);
          future_screenings = [];
        }
      });

      return filtered_films;
    }
  });

  Template.admSessions.rendered = function() {
    //Deixa o mês ativado.
    $(".btn-datepicker").click(function(){
       $(".btn-datepicker").removeClass("active");
       $(this).addClass("active");
    });
  };

  Template.admSessions.events({
    'change #city-selector': function (e) {
      var city = $(e.currentTarget).val();
      Session.set('city', city);
    },
    'change #st-selector': function (e) {
      var state = $(e.currentTarget).val();
      Session.set('state', state);
    },
    'change #title-selector': function (e) {
      var title = $(e.currentTarget).val();
      Session.set('title', title);
    },
    'change #ambassador-selector': function (e) {
      var ambassador = $(e.currentTarget).val();
      Session.set('ambassador', ambassador);
    },
    'click .btn-datepicker': function (e) {
      var month = $(e.currentTarget).data('month');
      Session.set('month', month);
    },
  });
}
