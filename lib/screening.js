if (Meteor.isClient) {

  Template.newScreening.rendered = function() {
    var nowDate = new Date();
    var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
    $('#date').datepicker({
      format:"dd/mm/yyyy",
      language: "pt-BR",
      startDate: today
    });
    $('.datetimepicker').timepicker();
    $("a[rel^='prettyPhoto']").prettyPhoto();

  },

  Template.newScreening.events({
    "submit #new-screening-form": function(event) {
      // Envia screening
      event.preventDefault();

      saveScreening(this._id, false);

    },
    "click #btn-save": function(event) {
      // Salva coomo rascunho
      event.preventDefault();

      saveScreening(this._id, true);


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

  function saveScreening (film_id, isDraft) {
    var form = document.getElementById('new-screening-form'),
        user_id = form.user_id.value;

    var address = saveAddress(form, user_id);

    var date = getDateObject(form.date, form.time);

    var screening = {
      _id: new Meteor.Collection.ObjectID().valueOf(),
      user_id: user_id,
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

    Meteor.call('addScreening', film_id, screening, function (error, result) {
      if (!error) {
        Router.go("ambassador");
      }
    });

    FlashMessages.sendSuccess('Sessão salva com sucesso!');

    // Início notifações

    ambassador = Meteor.users.findOne({_id: user_id});
    film = Films.findOne({_id: film_id});

    // Início noticação “Você tem uma sessão agendada”
    sessionTemplate = 'new-session.html';
    var new_session = {
      to: ambassador.emails[0].address,
      from: 'taturanamobi@gmail.com',
      subject: 'Você tem uma sessão agendada',
      name: ambassador.profile.name,
      data: moment(screening.date).format("L"),
      movie: film.title,
      absoluteurl: Meteor.absoluteUrl()
    };

    Meteor.call('sendEmail', new_session, sessionTemplate);
    // Fim noticação “Você tem uma sessão agendada”


    // Início - "Nos conte como foi sua sessão no dia (DD/MM)"
    howTemplate = 'how-session.html';
    var how_session = {
      to: ambassador.emails[0].address,
      from: 'taturanamobi@gmail.com',
      subject: 'Nos conte como foi sua sessão no dia (' + moment(screening.date).format("L") + ')',
      name: ambassador.profile.name,
      data: moment(screening.date).format("L"),
      movie: film.title,
      when: moment(screening.date).add(40, "hours").toDate(),
      absoluteurl: Meteor.absoluteUrl()
    };

    Meteor.call('insertTask', how_session, function (error, result) {
      if (!error) {
        var thisId = result;
        Meteor.call('scheduleNotify', thisId, how_session, howTemplate);
      }
    });

    // Fim - "Nos conte como foi sua sessão no dia (DD/MM)"

    // Início - "Precisamos saber como foi a sua sessão no dia (DD/MM)"
    reportTemplate = 'missing-report.html';
    var missing_report = {
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

    Meteor.call('insertTask', missing_report, function (error, result) {
      if (!error) {
        var thisId = result;
        // Agenda a verificação do relatório após uma semana da exibição do filme
        Meteor.call('verifyReport', thisId, missing_report, reportTemplate);
      }
    });
    // Início - "Precisamos saber como foi a sua sessão no dia (DD/MM)"



    // Fim notificações


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

    if (form.add_address.checked){
      Meteor.call('addAddress', user_id, address);
    }

    return  address;
  }

  function getDateObject(date, time) {
    var d = date.value.split('/'),
        t = time.value.split(':'),
        t2 = t[1].split(' ');

    if (t2[1] == 'PM') t[0] = parseInt(t[0]) + 12;

    return new Date(d[2], parseInt(d[1], 10) - 1, d[0], t[0], t2[0]);
  }

  Template.admScreening.events({
    "submit #edit-screening": function (event) {
      event.preventDefault();

      var form = document.getElementById('edit-screening-form'),
          address = saveAddress(form, event.target.user_id.value),
          date = getDateObject(event.target.date, event.target.time);

      var screening = {
        _id: event.target._id.value,
        user_id: event.target.user_id.value,
        place_name: address.place_name,
        cep: address.cep,
        street: address.street,
        number: address.number,
        complement: address.complement,
        zone: address.zone,
        uf: address.uf,
        city: address.city,
        s_country: address.s_country,
        public_event: form.public_event.checked,
        date: date,
        team_member: event.target.team_member.checked,
        activity: event.target.activity.value,
        activity_theme: event.target.activity_theme.value,
        quorum_expectation: event.target.quorum_expectation.value,
        comments: event.target.comments.value,
        accept_terms: event.target.accept_terms.checked
      };

      Meteor.call('updateScreening', screening, function(error, result) {
        if (!error) {
          Router.go("ambassador");
        }
      });

      FlashMessages.sendSuccess('Sessão salva com sucesso!');
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
    user_addresses: function(){
      if (!Meteor.user()) return;

      return Meteor.user().addresses;
    },
    address: function(replace_address){
      return Session.get("address");
    },
    is_selected: function(state) {
      var address = Session.get('address');

      if (!address) return;

      if (address.uf == state) {
        return 'selected';
      }
    }
  });

  Template.admScreening.helpers({
    user_addresses: function(){
      if (!Meteor.user()) return;

      return Meteor.user().addresses;
    },
    address: function(replace_address){

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
    is_selected: function(state) {
      var address = Session.get('address');

      if (!address) return;

      if (address.uf == state) {
        return 'selected';
      }
    }
  });

  Template.ambassador.helpers({
    ambassador_screenings: function () {
      screenings = Films.screenings_by_user_id();

      _.each(screenings, function(screening, i) {
        if (screening.date) {
          var d = moment(screening.date);
          screenings[i].formatted_date = d.format('D/M/Y [às] HH:mm');
        }
      });

      return screenings;
    },
  });

  Template.report.helpers({
    reportImage1: function(){
      return { file_type: 'report_image_1' }
    },
    reportImage2: function(){
      return { file_type: 'report_image_2' }
    },
    reportImage3: function(){
      return { file_type: 'report_image_3' }
    }

  });
}
