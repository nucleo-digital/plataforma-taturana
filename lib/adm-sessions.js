if (Meteor.isClient) {

  var get_films_fields = function() {

    var films_fields = {
      title: 1,
      poster_path: 1,
      screening: 1
    };

    return films_fields

  };

  var get_films_filter = function(Session) {
    // build the filter to apply against DB

    var filter_map = {
      'screening.city': Session.get('city'),
      'screening.uf': Session.get('state'),
      'title': Session.get('title'),
      'screening.team_member': Session.get('team'),
      'screening.public_event': Session.get('public')
    };

    var ambassador = Session.get('ambassador'),
        month = Session.get('month'),
        dStart, dEnd;

    // ambassador filter must get ambassador user id
    if (ambassador) {
      ambassador = Meteor.users.findOne({_id: ambassador});
      filter_map['screening.user_id'] = ambassador._id
    }

    // month filter should filter by range
    if (month) {
      // month is a number from 1 to 12, it is creepy but we will hold it
      // to 2016 for now :'(. note that in JS Date() month 0 is January,
      // month 11 is December, so to get items for april we receive
      // month == 4 which is month 3 in JS ISODate and should filter from
      // month 3 to 4 less 1 second (so we don't care about last day in month)
      dStart = new Date(2016, month - 1 , 1, 0, 0, 0);
      if (month == 11) {
        filter_map['screening.date'] = {$gte: dStart};
      } else {
        dEnd = new Date(new Date(2016, month, 1, 0, 0, 0).setSeconds(-1));
        filter_map['screening.date'] = {$gte: dStart, $lt: dEnd};
      }
    }

    if (Session.get('report')) {
      filter_map['screening.real_quorum'] = {$not: {$ne: null}}
    }

    if (Session.get('comment')) {
      filter_map['screening.comments'] = {$ne: null}
    }

    // remove unnecessary filters
    for (var field in filter_map) {
      if (!filter_map[field]) {
        delete filter_map[field];
      }
    }

    // do not get films without screenings for screening page
    filter_map['screening'] = {$ne: null}

    return filter_map;
  };

  Template.admSessions.helpers({
    films: function () {
      return Films.all().fetch();
    },
    ambassador_options: function (films) {
      var ambassadorsIds = [];

      _.each(films, function (film) {
        _.each(film.screening, function (screening) {
          if (screening.user_id) {
            ambassadorsIds.push(screening.user_id);
          }
        });
      });

      ambassadorsIds = _.uniq(ambassadorsIds);
      var ambassadors = Meteor.users.find({
        _id: {
          $in: ambassadorsIds
        }
      }, {
        _id:1,
        'profile.name': 1,
        sort: {'profile.name': 1}
      }).fetch();

      return _.uniq(ambassadors);
    },
    states_options: function () {
      return States.find({has_screenings: true}).fetch()
    },
    cities_options: function (films) {
      var filter = {has_screenings: true},
          state = Session.get('state');
      if (state) {
        filter.state = state
      }
      return Cities.find(filter, {sort: {name: 1, state: 1}}).fetch()
    },

    // Retorna o nome do embaixador da sessão
    get_name: function (userId) {
      user = Meteor.users.findOne({
        _id: userId
      });

      if (user && user.profile) {
        return user.profile.name
      }
    },

    // Retorna o email do embaixador da sessão
    get_email: function (userId) {
      return getEmail(userId);
    },

    // Retorna true se a sessão for anterior a data de hoje
    oldSession: function (date) {
      return date < new Date();
    },

    filtered_films: function () {
      var filtered_films = [],
          films_filter = get_films_filter(Session),
          screening_filter = {};  // will be populated
      var films_fields = get_films_fields();

      // build filter for film.screening
      for (var field in films_filter) {
        if (field.startsWith('screening.')) {
          screening_filter[field.split('.')[1]] = films_filter[field]
        }
      }

      var sort = {name: 1};

      var films = Films.find(
          films_filter, {
            fields: films_fields,
            sort: sort
          }
      );

      films.forEach(function (film) {
        _film = {};
        for (var field in films_fields) {
          if (!field.startsWith('screening')) {
            _film[field] = film[field];
          }
        }
        _film.screenings = new Array()
        film.screening.forEach(function(obj) {
          assertions = [];
          for (var screening_field in screening_filter) {
            if (screening_field == 'date') {
              var _date = obj.date,
                  start = screening_filter['date']['$gte'],
                  end = screening_filter['date']['$lt'];
              if (
                  (!(_date >= start && end &&_date <= end)) ||
                   !(_date >= start)
                )  {
                assertions.push(false);
              }
            } else if (screening_field == 'comments') {
              // need that because in the structure we have few docs with comments="" :facepalm:
              // mongo is a nosql db and so doesn't need standartized docs, so if u don't use
              // the field don't include it in structure...
              if (obj.comments.length == 0) {
                assertions.push(false);
              }
            } else if (screening_field == 'real_quorum') {
              if (obj.real_quorum) {
                assertions.push(false)
              }
            }else {
              if (obj[screening_field] != screening_filter[screening_field]) {
                assertions.push(false);
              }
            }
          }
          if (assertions.length == 0 || assertions.indexOf(false) == -1) {
            _film.screenings.push(obj);
          }
        });
        // console.debug("Before: ", film.screening.length, "After: ", _film.screenings.length);
        if (_film.screenings.length > 0) {
          // sort the screenings
            if (Session.get('creation_date')) {
              _film.screenings = _.sortBy(_film.screenings, function(obj) {return obj.created_at || obj.date});
            } else {
              _film.screenings = _.sortBy(_film.screenings, 'date');
            }
          filtered_films.push(_film);
        }
      });

      // console.debug("Filtered films with ", films_filter, "sorted by", sort, "with total of ", films.count())

      return filtered_films;

    }
  });

  Template.admSessions.rendered = function () {
    //Deixa o mês ativado.
    $(".btn-datepicker").click(function () {
      $(".btn-datepicker").removeClass("active");
      $(this).addClass("active");
    });
  };

  Template.admSessions.events({
    'change .list-sessions': function (e) {
      var list = $(e.currentTarget).val();
      Session.set('list', list);
    },
    'change #city-selector': function (e) {
      var city = $(e.currentTarget).val();
      Session.set('city', city);
    },
    'change #st-selector': function (e) {
      var state = $(e.currentTarget).val();
      Session.set('state', state);
    },
    'change #film-selector': function (e) {
      var title = $(e.currentTarget).val();
      Session.set('title', title);
    },
    'change #ambassador-selector': function (e) {
      var ambassador = $(e.currentTarget).val();
      Session.set('ambassador', ambassador);
    },
    'change #team-selector': function (e) {
      Session.set('team', e.currentTarget.checked);
    },
    'change #public-event': function (e) {
      Session.set('public', e.currentTarget.checked);
    },
    'change #comment': function (e) {
      Session.set('comment', e.currentTarget.checked);
    },
    'change #pendingReport': function (e) {
      Session.set('report', e.currentTarget.checked);
    },
    'change #creation-date': function (e) {
      Session.set('creation_date', e.currentTarget.checked);
    },
    'click .btn-datepicker': function (e) {
      var month = $(e.currentTarget).data('month');
      Session.set('month', month);
    },
    'click .btn-set-draft': function (e) {
      var id = this._id,
          user_id = this.user_id,
          film_and_screening = Films.return_film_and_screening(id);
      var film = film_and_screening.film,
          screening = film_and_screening.screening;

      Meteor.call('setScreeningDraftStatus', id, 'admin-draft');

      var emailTemplate = 'admin-draft.html';
      var data = {
        to: getEmail(user_id),
        from: 'taturanamobi@gmail.com',
        subject: 'Edite sua sessão do ' + film.title + ' / ' + moment(screening.date).format('L') + ')',
        name: getUserProfile(user_id).name,
        movie: film.title,
        absoluteurl: Meteor.absoluteUrl()
      };
      Meteor.call('sendEmail', data, emailTemplate);

    },
    'click .btn-unset-draft': function (e) {
      var id = $(e.currentTarget).data('session-id');
      Meteor.call('setScreeningDraftStatus', id, false);
    },
    "click .csv-export": function () {
      var screenings = this.screenings;
      var data = screenings.map(function (scr) {
        var d = moment(scr.date),
            created = moment(scr.created_at),
            contact = getUserProfile(scr.user_id);

        return {
          'id do embaixador': scr.user_id,
          'nome de contato': contact ? contact.name : '',
          'email de contato': getEmail(scr.user_id),
          'rascunho': (scr.draft) ? 'sim' : 'não',
          'evento público': (scr.public_event) ? 'sim' : 'não',
          'presença de equipe': (scr.team_member) ? 'sim' : 'não',
          'data do evento': d.format('D/M/Y'),
          'dia da semana': d.format('dddd'),
          'horário do evento': d.format('HH:mm'),
          'nome do local': scr.place_name,
          'cep': scr.cep,
          'cidade': scr.city,
          'estado': scr.uf,
          'bairro': scr.zone,
          'país': scr.s_country,
          'rua': scr.street,
          'número': scr.number,
          'complemento': scr.complement,
          'atividade': scr.activity,
          'tema da atividade': scr.activity_theme,
          'comentários': scr.comments,
          'expectativa de publico': scr.quorum_expectation,
          'publico real': scr.real_quorum,
          'descrição de report': scr.report_description,
          'data de criação': created.format('D/M/Y'),
          'horário de criação': created.format('HH:mm'),
          'id': scr._id,
        }
      });
      var csv = Papa.unparse(data);

      var filename = this.title.replace(" ", "_") + ".csv"
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, filename);
      } else {
          var link = document.createElement("a");
          if (link.download !== undefined) { // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", filename);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          } else {
             // else, show the file as before this changes, but name is "download"
             window.open(encodeURI('data:text/csv;charset=utf-8,' + csv));
	  }
      }
    }
  });
}

function getUserProfile(user_id) {
  var user = Meteor.users.findOne({
    _id: user_id
  });
  if (user && user.profile) {
    return user.profile;
  }
}

function getEmail(user_id) {
  var user = Meteor.users.findOne({
    _id: user_id
  });
  if (user && user.emails) {
    return user.emails[0].address;
  }
}
