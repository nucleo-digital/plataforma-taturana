Films = new Mongo.Collection("films");

//QuemSomos(mostra todos): portfolio
Films.portfolios = function() {
  return Films.find({status:"Portfolio"});
}
//Home(randomico): em difusão
Films.disseminates = function() {
  return Films.find({status:"Difusão"}).fetch();
}
Films.all = function(){
   return Films.find({}, {sort: {sequence_number: 1}});
}

Films.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  }
});

if (Meteor.isClient) {
  Meteor.subscribe("films");
  Template.films.helpers({
    films: function () {
      return Films.all();
    }
	});
}