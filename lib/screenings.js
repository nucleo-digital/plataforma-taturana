
if (Meteor.isClient) {
  Template.screenings.helpers({
    films: function() {
      // retorna filmes com sessões futuras
      var films = Films.all().fetch(),
          screenings,
          future_screenings = [],
          filtered_films = [],
          today = new Date(),
          d, scheduledDate;

      _.each(films, function(film) {
        screenings = film.screening || [];

        _.each(screenings, function(screening) {
          d = screening['date'].split('/');
          scheduledDate = new Date(d[1] + '/' + d[0] + '/' + d[2] + ' ' + screening['time']);

          if (scheduledDate.getTime() > today.getTime()) {
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
    },
    format_date: function(date) {
      var d = date.split('/');

      return d[0] + '/' + d[1];
    },
    format_time: function(time) {
      var t = time.split(' '),
          t2 = t[0].split(':');

      if (t[1] == 'PM') {
        t2[0] = parseInt(t2[0]) + 12;
      }

      return t2[0] + ':' + t2[1];
    }
  });
}
