if (Meteor.isClient) {
  Template.homeCarousel.rendered = function() {
    $('#carousel').slick({
      arrows: true,
      infinite: true
    });
  }
  Template.home.helpers({
	  disseminate: function() {
	    var filmsport = Films.films_disseminate();
	    var film_amount = filmsport.length;
	    var i = 0;
	    var random_films = [];
	    var arr_numbers = [];
	    if (film_amount > 6){
	    	it_times = 6 
	    } else { it_times = film_amount}

	    while (i < it_times) {
	    	var random_number = Math.floor((Math.random() * film_amount) + 0);
		    if (arr_numbers.indexOf(random_number) == -1){
		    	arr_numbers[i] = random_number;
		    	random_films.push(filmsport[random_number]);
		    	i++;
		    }
		  }
	    return random_films;
	  }
	});
}

