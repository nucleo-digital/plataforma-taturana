if (Meteor.isClient) {
  Template.homeCarousel.rendered = function() {
    $('#carousel').slick({
      arrows: true,
      infinite: false
    });
  }
}

