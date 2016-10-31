if (  Meteor.isClient) {

  var films_fields = {
    title: 1,
    poster_path: 1,
    screening: 1
  };

  var get_films_filter = function(Session) {
    // build the filter to apply against DB

    var filter_map = {
      'screening.city': Session.get('city'),
      'screening.state': Session.get('state'),
      'screening.month': Session.get('month'),
      'screening.title': Session.get('title'),
      'screening.team': Session.get('team'),
      'screening.public': Session.get('public'),
      'screening.comment': Session.get('comment'),
      'screening.report': Session.get('report'),
      'screening.creation_date': Session.get('creation_date')
    };

    var ambassador = Session.get('ambassador'),
        month = Session.get('month'),
        dStart, dEnd;

    // ambassador filter must get ambassador user id
    if (ambassador) {
      ambassador = Meteor.users.findOne({
        name: ambassador
      });
      filter_map['screening.user_id'] = ambassador
    }

    // month filter should filter by range
    if (month) {
      // month is a number from 1 to 12, it is creepy but we will hold it
      // to 2016 for now :'(. note that in JS Date() month 0 is January,
      // month 11 is December, so to get items for april we receive
      // month == 4 which is month 3 in JS ISODate and should filter from
      // month 3 to 4 less 1 second (so we don't care about last day in month)
      dStart = new Date(2016, month - 1 , 1, 0, 0, 0);
      dEnd = new Date(new Date(2016, month, 1, 0, 0, 0).setSeconds(-1));
      filter_map['screening.date'] = {$gte: dStart, $lt: dEnd};
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
    //
    // if ((!filtered_city || screening['city'] == filtered_city) &&
    //     (!filtered_state || screening['uf'] == filtered_state) &&
    //     (!filtered_ambassador || screening['user_id'] == filtered_ambassador) &&
    //     (!filtered_month || screening['date'].getMonth() + 1 == filtered_month) &&
    //     (!filtered_team || screening['team_member'] == filtered_team) &&
    //     (!filtered_public || screening['public_event'] == filtered_public) &&
    //     (!filtered_report || !screening['real_quorum']) &&
    //     (!filtered_comment || screening['comments']) &&
    //     (!filtered_title || film['title'] == filtered_title)) {
    //   filtered_screenings.push(screening);
    // }

  };

  Template.admSessions.helpers({
    films: function () {
      return Films.all().fetch();
    },
    ambassador_options: function (films) {
      var ambassadorsIds = [],
        ambassadors = [],
        names = []

      _.each(films, function (film) {
        _.each(film.screening, function (screening) {
          if (screening.user_id) {
            ambassadorsIds.push(screening.user_id);
          }
        });
        ambassadorsIds = _.uniq(ambassadorsIds);
        ambassadors = Meteor.users.find({
          _id: {
            $in: ambassadorsIds
          }
        }).fetch();
      });

      _.each(ambassadors, function (amb) {
        if (amb.profile) {
          names.push({
            name: amb.profile.name.toLowerCase(),
            id: amb._id
          });
        }
      });

      names = _.sortBy(names, 'name');
      return _.uniq(names);
    },
    states_options: function (films) {
      return ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE"];
    },
    cities_options: function (films) {
      var cities = [];

      _.each(films, function (film) {
        _.each(film.screening, function (screening) {
          if (screening.city) {
            cities.push(screening.city);
          }
        });
      });

      return _.uniq(cities);
    },

    // Retorna o nome do embaixador da sessão
    get_name: function (userId) {
      user = Meteor.users.findOne({
        _id: userId
      });

      if (user && user.profile) {
        return user.profile.name
      };
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
      console.debug('oi');
      var films = Films.find(
          get_films_filter(Session), {
            fields: films_fields,
            sort: {'name': 1, 'screening.date': -1}
          }
      );

      // TODO: there is no created_at in screenings so we order by desc screening.date
      //       to show newer objects first
      // if (Session.get('creation_date')) {
      //   filtered_screenings = _.sortBy(filtered_screenings, 'created_at');
      // } else {
      //   filtered_screenings = _.sortBy(filtered_screenings, 'date');
      // }

      films = films.fetch();
      return films

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
      var id = this._id;
      var user_id = this.user_id;
      var film = Films.by_screening_id(id);

      Meteor.call('setScreeningDraftStatus', id, 'admin-draft');

      var emailTemplate = 'admin-draft.html';
      var data = {
        to: getEmail(user_id),
        from: 'taturanamobi@gmail.com',
        subject: 'Tudo certo para a sua sessão?',
        name: getUserProfile(user_id).name,
        movie: film.title,
        absoluteurl: Meteor.absoluteUrl()
      };
    },
    'click .btn-unset-draft': function (e) {
      var id = $(e.currentTarget).data('session-id');
      Meteor.call('setScreeningDraftStatus', id, false);
    },
    "click .csv-export": function () {
      var screenings = this.screenings;
      var data = this.screening.map(function (scr) {
        var d = moment(scr.date),
            created = moment(scr.created_at);

        return {
          'nome de contato': getUserProfile(scr.user_id).name,
          'email de contato': getEmail(scr.user_id),
          'rascunho': (scr.draft) ? 'sim' : 'não',
          'evento público': (scr.public_event) ? 'sim' : 'não',
          'presença de equipe': (scr.team_member) ? 'sim' : 'não',
          'data do evento': d.format('D/M/Y'),
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
          'expectativa de público': scr.real_quorum,
          'publico real': scr.quorum_expectation,
          'descrição de report': scr.report_description,
          'id': scr._id,
          'id do embaixador': scr.user_id,
          'data de criação': created.format('D/M/Y'),
          'horário de criação': created.format('HH:mm')
        }
      });
      var csv = Papa.unparse(data);
      window.open(encodeURI('data:text/csv;charset=utf-8,' + csv));
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
