if (Meteor.isClient) {
  Template.showFilm.helpers({
    linklist: function () {
      var print_links = []
      var links = ["facebook", "twitter", "youtube", "instagram"]
      var film = this
      links.every(function(elem) {
        if (film[elem]) {
          print_links.push({name:elem, link:film[elem]});
        }  
      });
      return print_links;
    }
  });
  Template.showFilm.rendered = function() {
    $('#carousel').slick({
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 6000,
    });
  }
//   Template.showFilm.rendered = function() {
//     $(".fancybox").fancybox({
// 	   "type": "image"
// 	});
//   }
}


