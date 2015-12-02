//QuemSomos(mostra todos): portfolio
Films.films_portfolio = function() {
  return Films.find({status:"Portfolio"});
}
//Home(randomico): em difusão
Films.films_disseminate = function() {
  return Films.find({status:"Difusão"}).fetch();
}

if (Meteor.isClient) {
  Template.films.helpers({
	  films: function () {
	    return Films.find({});
	  }
	});
}