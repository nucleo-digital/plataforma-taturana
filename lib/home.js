if (Meteor.isClient) {
  Template.carousel.rendered = function() {
    $('#carousel').slick({
      dots: true,
      arrows: true
    });
  }
}

