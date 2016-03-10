if (Meteor.isClient) {

  Template.carouselItem.rendered = function() {
      console.log('carouselItem rendered');
      $('#carousel').slick('unslick');

      $('#carousel').slick({
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 6000,
      });
  }

  Template.home.events({
    "click #home-films button": function (event) {
    	Router.go('/screenings');
    }
  });

  Template.homeCarousel.helpers({
	  disseminate: function() {
      console.log('disseminate');
      return Films.disseminate();
	  },
    inventory: function(){
      return Films.inventory(this);
    }
  });

}
