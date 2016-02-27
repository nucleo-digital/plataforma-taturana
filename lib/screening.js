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
        quorum_expectation: event.target.quorum_expectation.value,
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
        quorum_expectation: event.target.quorum_expectation.value,
        comments: event.target.comments.value,
        accept_terms: event.target.accept_terms.value
      }
      Meteor.call('updateScreening', screening);
    }
  });

  Template.ambassador.helpers({
    ambassador_screenings: function () {
      return Films.by_user_id();
    }
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


