if (Meteor.isClient) {

  Template.newScreening.rendered = function () {
    var nowDate = new Date();
    var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 2, 0, 0, 0, 0);

    $(".readonly").keydown(function (e) {
      e.preventDefault();
    });
    $('#date').datepicker({
      format: "dd/mm/yyyy",
      language: "pt-BR",
      startDate: today
    });
    $('.datetimepicker').timepicker();
    $("a[rel^='prettyPhoto']").prettyPhoto();

  };

  Template.newScreening.events({
    "click #btn-send": function (event) {
      event.preventDefault();
      // Envia screening

      var form = document.getElementById('new-screening-form');
      saveScreening(form, this._id, false, 'create-publish');
    },
    "click #btn-save": function (event) {
      // Salva coomo rascunho
      event.preventDefault();
      var form = document.getElementById('new-screening-form');
      saveScreening(form, this._id, true, 'create');
    },
    "click .remove_address": function (event) {
      Meteor.call('removeAddress', Meteor.user()._id, this);
    },
    "click .replace_address": function () {
      //set state
      $('#uf').find('#' + this.uf).attr('selected', 'selected');
      Session.set("address", this);
    }
  });


  function getDateObject(date, time) {
    var d = date.value.split('/'),
      t = time.value.split(':'),
      t2 = t[1].split(' ');

    if (t2[1] == 'PM') t[0] = parseInt(t[0]) + 12;

    return new Date(d[2], parseInt(d[1], 10) - 1, d[0], t[0], t2[0]);
  }

  Template.admScreening.rendered = function () {
    var nowDate = new Date();
    var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 2, 0, 0, 0, 0);

    $(".readonly").keydown(function (e) {
      e.preventDefault();
    });
    $('#date').datepicker({
      format: "dd/mm/yyyy",
      language: "pt-BR",
      startDate: today
    });
    $('.datetimepicker').timepicker();
    $("a[rel^='prettyPhoto']").prettyPhoto();
  };

  Template.admScreening.events({
    "click #btn-send": function (event) {
      // Envia screening
      event.preventDefault();
      var form = document.getElementById('edit-screening-form');
      saveScreening(form, this.film._id, false, 'publish');
    },
    "click #btn-save": function (event) {
      // Salva como rascunho
      event.preventDefault();
      var form = document.getElementById('edit-screening-form');
      var draft = $('#btn-save').attr('data-status');
      saveScreening(form, this.film._id, draft, 'update');
    },
    "click .remove_address": function (event) {
      Meteor.call('removeAddress', Meteor.user()._id, this);
    },
    "click .replace_address": function () {
      //set state
      $('#uf').find('#' + this.uf).attr('selected', 'selected');
      Session.set("address", this);
    }
  });

  Template.newScreening.helpers({
    user_addresses: function () {
      if (!Meteor.user()) return;

      return Meteor.user().addresses;
    },
    address: function (replace_address) {
      return Session.get("address");
    },
    is_selected: function (state) {
      var address = Session.get('address');

      if (!address) return;

      if (address.uf == state) {
        return 'selected';
      }
    }
  });

  Template.admScreening.helpers({
    user_addresses: function () {
      if (!Meteor.user()) return;
      return Meteor.user().addresses;
    },
    address: function (replace_address) {

      if (!Session.get('address')) {
        var saved_address = {
          cep: this.screening.cep,
          city: this.screening.city,
          complement: this.screening.complement,
          number: this.screening.number,
          place_name: this.screening.place_name,
          uf: this.screening.uf,
          street: this.screening.street,
          zone: this.screening.zone,
          s_country: this.screening.s_country
        }

        Session.set('address', saved_address);
      }

      return Session.get('address');
    },
    is_selected: function (state) {
      var address = Session.get('address');

      if (!address) return;

      if (address.uf == state) {
        return 'selected';
      }
    },
    is_draft: function () {
      return this.screening.draft;
    }
  });

  Template.ambassador.helpers({
    ambassador_screenings: function () {
      screenings = Films.screenings_by_user_id();

      _.each(screenings, function (screening, i) {
        if (screening.date) {
          var d = moment(screening.date);
          screenings[i].formatted_date = d.format('D/M/Y [às] HH:mm');
        }
      });
      return screenings;
    },
  });

  Template.report.helpers({
    reportImage1: function () {
      return {
        file_type: 'report_image_1'
      }
    },
    reportImage2: function () {
      return {
        file_type: 'report_image_2'
      }
    },
    reportImage3: function () {
      return {
        file_type: 'report_image_3'
      }
    }

  });
}

function saveScreening(form, film_id, isDraft, action) {
  var user_id = form.user_id.value;
  var address = saveAddress(form, user_id);
  var date = getDateObject(form.date, form.time);
  var screening = {
    date: date,
    team_member: form.team_member.checked,
    activity: form.activity.value,
    activity_theme: form.activity_theme.value,
    quorum_expectation: form.quorum_expectation.value,
    comments: form.comments.value,
    accept_terms: form.accept_terms.checked,
    place_name: address.place_name,
    cep: address.cep,
    street: address.street,
    number: address.number,
    complement: address.complement,
    zone: address.zone,
    city: address.city,
    public_event: form.public_event.checked,
    uf: address.uf,
    s_country: address.s_country
  };

  if (isDraft) {
    screening.draft = true;
  }

  if (action == 'create' || action == 'create-publish') {
    screening.created_at = new Date();
    screening.user_id = user_id;
    screening._id = new Meteor.Collection.ObjectID().valueOf();

    Meteor.call('addScreening', film_id, screening, function (error, result) {
      if (!error) {
        Router.go("ambassador");
      }
    });
    FlashMessages.sendSuccess('Sessão salva com sucesso!');
  } else {
    screening._id = form._id.value;
    Meteor.call('updateScreening', screening, function (error, result) {
      if (!error) {
        if (Meteor.user().profile.roles[0] === 'admin') {
          Router.go("adm/sessions");
        } else {
          Router.go("ambassador");
        }
      }
    });
    FlashMessages.sendSuccess('Sessão salva com sucesso!');
  }

  if (action == 'publish' || action == 'create-publish') {
    scheduleNotifications(user_id, film_id, screening);
  }

  Session.set("address", null);
}

function saveAddress(form, user_id) {
  var address = {
    _id: new Meteor.Collection.ObjectID().valueOf(),
    place_name: form.place_name.value,
    cep: form.cep.value,
    street: form.street.value,
    number: form.number.value,
    complement: form.complement.value,
    zone: form.zone.value,
    city: form.city.value,
    uf: form.uf.value,
    s_country: form.s_country.value
  }

  if (form.add_address.checked) {
    Meteor.call('addAddress', user_id, address);
  }

  return address;
}

function scheduleNotifications(user_id, film_id, screening) {
  // Todo: refatorar o envio de notificacoes
  // Início notifações
  var email_template,
    email_data;

  var ambassador = Meteor.users.findOne({
    _id: user_id
  });

  var film = Films.findOne({
    _id: film_id
  });

  if (short_deadline(screening.date)) {
    email_template = 'new-session-short-deadline.html';
    email_data = {
      to: ambassador.emails[0].address,
      from: 'taturanamobi@gmail.com',
      subject: 'Você tem uma sessão agendada',
      name: ambassador.profile.name,
      data: moment(screening.date).format("L"),
      screening_id: screening._id,
      movie: film.title,
      absoluteurl: Meteor.absoluteUrl()
    };
    Meteor.call('sendEmail', email_data, email_template);
  } else {
    // Início noticação - “Você tem uma sessão agendada”
    email_template = 'new-session.html';
    email_data = {
      to: ambassador.emails[0].address,
      from: 'taturanamobi@gmail.com',
      subject: 'Você tem uma sessão agendada',
      name: ambassador.profile.name,
      data: moment(screening.date).format("L"),
      screening_id: screening._id,
      movie: film.title,
      absoluteurl: Meteor.absoluteUrl()
    };

    Meteor.call('sendEmail', email_data, email_template);
    // Fim noticação “Você tem uma sessão agendada”

    // Início - confirmação da data - 10 dias antes da sessão

    var confirm_event_date_template = 'confirm-event-date.html';
    var confirm_event_date_data = {
      to: ambassador.emails[0].address,
      from: 'taturanamobi@gmail.com',
      subject: 'Tudo certo para a sua sessão?',
      name: ambassador.profile.name,
      data: moment(screening.date).format("L"),
      screening_id: screening._id,
      movie: film.title,
      when: moment(screening.date).subtract(10, "days").toDate(),
      absoluteurl: Meteor.absoluteUrl()
    };

    Meteor.call('insertTask', confirm_event_date_data, function (error, result) {
      if (!error) {
        var thisId = result;
        Meteor.call('scheduleNotify', thisId, confirm_event_date_data, confirm_event_date_template);
      }
    });

    // Fim - confirmação da data - 10 dias antes da sessão
  }

  // Início - envio do filme - 7 dias antes ou 2 dias após o agendamento
  var send_movie_template = 'send-movie.html';
  var send_movie_data = {
    to: ambassador.emails[0].address,
    from: 'taturanamobi@gmail.com',
    subject: 'Download do filme ' + film.title,
    name: ambassador.profile.name,
    data: moment(screening.date).format("L"),
    screening_id: screening._id,
    movie: film.title,
    when: send_movie_date(screening.date),
    absoluteurl: Meteor.absoluteUrl(),
    link: film.link_for_download,
    pass: film.password_for_download
  };

  Meteor.call('insertTask', send_movie_data, function (error, result) {
    if (!error) {
      var thisId = result;
      Meteor.call('scheduleNotify', thisId, send_movie_data, send_movie_template);
    }
  });

  // Fim - envio do filme - 7 dias antes ou 2 dias após o agendamento


  // Início - cobrança de relatório 40h depois da data da sessão
  var how_session_template = 'how-session.html';
  var how_session_data = {
    to: ambassador.emails[0].address,
    from: 'taturanamobi@gmail.com',
    subject: 'Nos conte como foi sua sessão no dia (' + moment(screening.date).format("L") + ')',
    name: ambassador.profile.name,
    data: moment(screening.date).format("L"),
    screening_id: screening._id,
    movie: film.title,
    when: moment(screening.date).add(40, "hours").toDate(),
    absoluteurl: Meteor.absoluteUrl()
  };

  Meteor.call('insertTask', how_session_data, function (error, result) {
    if (!error) {
      var thisId = result;
      Meteor.call('scheduleNotify', thisId, how_session_data, how_session_template);
    }
  });

  // Fim - cobrança de relatório 40h depois da data da sessão

  // Início - cobrança de relatório uma semana depois da data da sessão
  var missing_report_template = 'missing-report.html';
  var missing_report_data = {
    to: ambassador.emails[0].address,
    from: 'taturanamobi@gmail.com',
    subject: 'Precisamos saber como foi a sua sessão no dia (' + moment(screening.date).format("L") + ')',
    name: ambassador.profile.name,
    data: moment(screening.date).format("L"),
    movie: film.title,
    screening_id: screening._id,
    when: moment(screening.date).add(1, "week").toDate(),
    absoluteurl: Meteor.absoluteUrl()
  };

  Meteor.call('insertTask', missing_report_data, function (error, result) {
    if (!error) {
      var thisId = result;
      // Agenda a verificação do relatório após uma semana da exibição do filme
      Meteor.call('scheduleNotify', thisId, missing_report_data, missing_report_template);
    }
  });
  // Início - cobrança de relatório uma semana depois da data da sessão

  // Início - email de resultado - 3 meses depois da sessão

  var share_result_template = 'share-result.html';
  var share_result_data = {
    to: ambassador.emails[0].address,
    from: 'taturanamobi@gmail.com',
    subject: 'Sua contribuição na difusão social do ' + film.title,
    name: ambassador.profile.name,
    data: moment(screening.date).format("L"),
    screening_id: screening._id,
    movie: film.title,
    when: moment(screening.date).add(3, "month").toDate(),
    absoluteurl: Meteor.absoluteUrl(),
    slug: film.friendlySlugs.slug.base
  };

  Meteor.call('insertTask', share_result_data, function (error, result) {
    if (!error) {
      var thisId = result;
      Meteor.call('scheduleNotify', thisId, share_result_data, share_result_template);
    }
  });

  // Fim - email de resultado - 3 meses depois da sessão
  // Fim notificações
}

function send_movie_date(screening_date) {
  var days = 9;
  if (short_deadline(screening_date)) {
    days = 2;
  };

  return moment(Date()).add(days, "days").toDate();
}

function short_deadline(screening_date) {
  var today = moment(Date());
  var days_for = today.diff(moment(screening_date), 'days');

  if (days_for > -9) {
    return true;
  }
}