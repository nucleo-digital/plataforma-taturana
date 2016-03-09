if (Meteor.isClient) {

  Template.homeCarousel.rendered = function() {
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
      return Films.disseminate();
	  },
    inventory: function(){
      return Films.inventory(this);
    }
  });

}
