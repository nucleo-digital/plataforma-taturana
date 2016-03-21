if (Meteor.isClient) {
  Template.report.events({
    "submit #report": function (event) {
      event.preventDefault();
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
      FlashMessages.sendSuccess('Relatório enviado com sucesso!')

    }
  });
}
