if (Meteor.isClient) {

  Template.newScreening.rendered = function() {
    $('#date').datepicker({
      format: "dd/mm/yyyy",
      language: "pt-BR"
    });
    $('.datetimepicker').timepicker();
  }

  Template.newScreening.events({
    "submit #new-screening": function (event) {
      event.preventDefault();
      film_id = this._id;
      user_id = event.target.user_id.value;

      var address = {
        _id: new Meteor.Collection.ObjectID().valueOf(),
        place_name: event.target.place_name.value,
        cep: event.target.cep.value,
        street: event.target.street.value,
        number: event.target.number.value,
        complement: event.target.complement.value,
        zone: event.target.zone.value,
        city: event.target.city.value,
        uf: event.target.uf.value,
        s_country: event.target.s_country.value
      }

      if (event.target.add_address.value === 'on'){
        Meteor.call('addAddress', user_id, address);
      }

      // change date and time for object
      var d = event.target.date.value.split('/'),
          t = event.target.time.value.split(':'),
          t2 = t[1].split(' ');

      if (t2[1] == 'PM') t[0] = parseInt(t[0]) + 12;

      var date = new Date(d[2], parseInt(d[1], 10) - 1, d[0], t[0], t2[0]);

      var screening = {
        _id: new Meteor.Collection.ObjectID().valueOf(),
        user_id: user_id,
        date: date,
        team_member: event.target.team_member.checked,
        activity: event.target.activity.value,
        activity_theme: event.target.activity_theme.value,
        quorum_expectation: event.target.quorum_expectation.value,
        comments: event.target.comments.value,
        accept_terms: event.target.accept_terms.checked
      }
      Meteor.call('addScreening', film_id, screening, address );
      FlashMessages.sendSuccess('Sessão salva com sucesso!')
    },
    "click .remove_address": function (event) {
      console.log("pã!");
      console.log(this);
      Meteor.call('removeAddress', Meteor.user()._id, this);
    },
    "click .replace_address": function () {
      Session.set("address", this);
    }
  });

  Template.admScreening.events({
    "submit #edit-screening": function (event) {
      event.preventDefault();

      // change date and time for object
      // TODO adicionar método para um helper/utils
      var d = event.target.date.value.split('/'),
          t = event.target.time.value.split(':'),
          t2 = t[1].split(' ');

      if (t2[1] == 'PM') t[0] = parseInt(t[0]) + 12;

      var date = new Date(d[2], parseInt(d[1], 10) - 1, d[0], t[0], t2[0]);

      var screening = {
        _id: event.target._id.value,
        user_id: event.target.user_id.value,
        place_name: event.target.place_name.value,
        cep: event.target.cep.value,
        street: event.target.street.value,
        number: event.target.number.value,
        complement: event.target.complement.value,
        zone: event.target.zone.value,
        uf: event.target.uf.value,
        city: event.target.city.value,
        s_country: event.target.s_country.value,
        date: date,
        team_member: event.target.team_member.checked,
        activity: event.target.activity.value,
        activity_theme: event.target.activity_theme.value,
        quorum_expectation: event.target.quorum_expectation.value,
        comments: event.target.comments.value,
        accept_terms: event.target.accept_terms.checked
      }

      Meteor.call('updateScreening', screening);
      FlashMessages.sendSuccess('Sessão salva com sucesso!')
    }
  });

  Template.newScreening.helpers({
    user_addresses: function(){
      return Meteor.user().addresses;
    },
    address: function(replace_address){
      return Session.get("address");
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
  Template.report.events({
    "submit #report": function (event) {
      event.preventDefault();
      console.log(this);
      console.log(this["screening"]);
      var screening = this["screening"]
      var items = ["real_quorum", "report_description", "report_image_1", "report_image_2", "report_image_3", "author_1", "author_2", "author_3"]

      var report = {
        real_quorum: event.target.real_quorum.value,
        report_description: event.target.report_description.value,
        report_image_1: Session.get('report_image_1'),
        report_image_2: Session.get('report_image_2'),
        report_image_3: Session.get('report_image_3'),
        author_1: event.target.author_1.value,
        author_2: event.target.author_2.value,
        author_3: event.target.author_3.value,
      }

      for (i = 0; i < items.length; i++) {
        if (report[items[i]] !== undefined) {
          screening[items[i]] = report[items[i]];
        }
      }

      Meteor.call('updateScreening', screening);

    }
  });

}
