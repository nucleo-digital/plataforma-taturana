if (Meteor.isClient) {

  Template.newScreening.rendered = function() {
    $('#date').datepicker({
      format: "dd/mm/yyyy",
      language: "pt-BR"
    });
    $('.datetimepicker').timepicker();
  }

  Template.newScreening.events({
    "submit .new-screening": function (event) {
      console.log("pã!");
      var film_id = this._id;
      event.preventDefault();
      var screening = {
        _id: new Meteor.Collection.ObjectID().valueOf(),
        user_id: event.target.user_id.value,
        place_name: event.target.place_name.value,
        cep: event.target.cep.value,
        street: event.target.street.value,
        number: event.target.number.value,
        complement: event.target.complement.value,
        zone: event.target.zone.value,
        city: event.target.city.value,
        s_country: event.target.s_country.value,
        date: event.target.date.value,
        time: event.target.time.value,
        team_member: event.target.team_member.value,
        activity: event.target.activity.value,
        activity_theme: event.target.activity_theme.value,
        quorum: event.target.quorum.value,
        comments: event.target.comments.value,
        accept_terms: event.target.accept_terms.value
      }
      Meteor.call('addScreening', film_id, screening );
    }
  });

  Template.admScreening.events({
    "submit #edit-screening": function (event) {
      event.preventDefault();
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
        date: event.target.date.value,
        time: event.target.time.value,
        team_member: event.target.team_member.value,
        activity: event.target.activity.value,
        activity_theme: event.target.activity_theme.value,
        quorum: event.target.quorum.value,
        comments: event.target.comments.value,
        accept_terms: event.target.accept_terms.value
      }
      Meteor.call('updateScreening', screening);
    }
  });

  Template.ambassador.helpers({
    ambassador_screenings: function () {
      return Films.by_user_id();
      // var user_id = Meteor.userId();
      // var films = Films.find({"screening.user_id":user_id}).fetch();
      // var user_screenings = []

      // for (a = 0; a < films.length; a++) { 
      //   var f_scr = films[a].screening
      //   for (i = 0; i < f_scr.length; i++) { 
      //     if (f_scr[i].user_id == user_id) {
      //       f_scr[i].title = films[a].title;
      //       f_scr[i].film_id = films[a]._id;
      //       f_scr[i].film_press_kit = films[a].press_kit_path;
      //       user_screenings.push(f_scr[i]);
      //     }
      //   }
      // }
      // return user_screenings;
    }
  });
 
}


