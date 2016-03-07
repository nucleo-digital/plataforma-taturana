if (Meteor.isClient) {
  Template.admReport.helpers({
    film: function() {
      var screening_id = this._id;

      return Films.by_screening_id(screening_id);
    },
    in_slideshow: function(src) {
      var f = Films.by_screening_id(this._id),
          images = f.slideshow,
          result = false;

      if (!images) return false;

      _.each(images, function(image) {
        if (image.src == src) result = true;
      })

      return result;
    },
  })

  Template.admReport.events({
    'click .btn-image-add': function(event) {
      event.preventDefault();

      var filmId = $('.report-images').data('film-id');

      Meteor.call('addToSlideshow', filmId, {
        _id: new Meteor.Collection.ObjectID().valueOf(),
        src: $(event.currentTarget).data('image-src'),
        caption: $(event.currentTarget).siblings('textarea').val()
      });
    },
    'click .btn-image-remove': function(event) {
      event.preventDefault();

      var filmId = $('.report-images').data('film-id');

      Meteor.call(
        'removeFromSlideshow',
        filmId,
        $(event.currentTarget).data('image-src')
      );
    },
  });
}
