if (Meteor.isClient) {

  Template.homeCarouselItem.rendered = function() {
    setTimeout(function() {
      $('#carousel').slick({
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 6000,
        adaptiveHeight: true,
        slidesToShow: 1,
        slidesToScroll: 1
      });
    }, 500);
  }

  Template.home.events({
    "click #home-films button": function (event) {
    	Router.go('/screenings');
    }
  });

  Template.homeCarousel.helpers({
	  disseminate: function() {
      return Films.find({status:{ $in: ["Difusão", "Difusão/Portfolio"]}});
	  },
    inventory: function(){
      return Films.inventory(this);
    }
  });

}
