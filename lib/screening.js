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
        place_name: event.target.place_name.value,
        cep: event.target.cep.value,
        street: event.target.street.value,
        number: event.target.number.value,
        complement: event.target.complement.value,
        zone: event.target.zone.value,
        city: event.target.city.value,
        s_country: event.target.s_country.value,
        day: event.target.day.value,
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

  Template.screenings.helpers({
    films: function () {
      return Films.all();
    }
  });
 
}


