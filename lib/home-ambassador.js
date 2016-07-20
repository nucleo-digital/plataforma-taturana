if (Meteor.isClient) {
  Template.ambassador.helpers({
    disseminate: function() {
      return Films.disseminate();
    },
    session_status_icon: function(screening) {
      // Rascunho
      if (screening.draft) {
        return 'edit';
      }

      // Agendada
      var today = new Date();

      if (today.getTime() < screening.date.getTime()) {
        return 'calendar';
      }

      // Completo
      if (_.has(screening, 'report_description')) {
        return 'complete';
      }

      // Falta relatório
      return 'report-pending';
    },
    in_future: function(screening) {
      var today = new Date();

      return (today.getTime() < screening.date.getTime() || screening.draft == 'admin-draft'));
    },
    is_report_pending: function(screening) {
      return !_.has(screening, 'report_description');
    }
  });
  Template.ambassador.events({
    "click .destroy": function () {
      Meteor.call('removeScreening', this._id);
    }
  });
}
