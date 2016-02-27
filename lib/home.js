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
    shortsynopsis: function(){
      var s_text = this.synopsis;
      var n_text = s_text.substring(0, 430);
      return n_text + "...";   
    },
    film_inventory: function(){
      return Films.return_inventory(this.title);
    }
  });

}
