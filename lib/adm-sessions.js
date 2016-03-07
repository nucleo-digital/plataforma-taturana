
if (Meteor.isClient) {
  Template.admSessions.helpers({
    films: function() {
      return Films.all().fetch();
    },
    format_date: function(d) {
      return {
        date: d.getDate() + '/' + (d.getMonth() + 1),
        time: d.getHours() + ':' + d.getMinutes()
      };
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
            screening.date_obj = get_date(screening['date'], screening['time']);

            // applica filtros
            var filtered_city = Session.get('city'),
                filtered_state = Session.get('state'),
                filtered_month = Session.get('month'),
                filtered_title = Session.get('title'),
                scheduledDate = screening['date_obj'];

            if ((!filtered_city || screening['city'] == filtered_city) &&
              (!filtered_state || screening['state'] == filtered_state) &&
              (!filtered_month || scheduledDate.getMonth() == filtered_month) &&
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
    'click .btn-datepicker': function (e) {
      var month = $(e.currentTarget).data('month');
      console.log(month);
      Session.set('month', month);
    },
  });

  /* Get a date object from string
   *
   * @param String
   *
   * @return Date
   */
  function get_date(date, time) {
    var d = date.split('/'),
        t = time.split(':'),
        m = t[1].split(' '),
        h;

    if (m[1] == 'PM') {
      h =  parseInt(t[0]) + 12;
    }

    return new Date(d[2], (d[1] - 1), d[0], h, m[0]);
  }
}
