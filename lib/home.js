if (Meteor.isClient) {

  Template.homeCarousel.rendered = function() {
    setTimeout(function() {
      console.log('carousel');
      $('#carousel').slick({
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 6000,
      });
    }, 2000);
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
