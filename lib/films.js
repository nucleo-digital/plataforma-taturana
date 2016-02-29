Films = new Mongo.Collection("films");

//QuemSomos(mostra todos): portfolio
Films.portfolio = function() {
  return Films.find({status:"Portfolio"});
}
//Home(randomico): em difusão
Films.disseminate = function() {
  return Films.find({status:"Difusão"}).fetch();
}
Films.all = function(){
  return Films.find({}, {sort: {sequence_number: 1}});
}
Films.count = function(){
  return Films.all().count();
}
Films.by_user_id = function() {
  var user_id = Meteor.userId();
  var films = Films.find({"screening.user_id":user_id}).fetch();
  var user_screenings = []

  for (a = 0; a < films.length; a++) {
    var f_scr = films[a].screening
    for (i = 0; i < f_scr.length; i++) {
      if (f_scr[i].user_id == user_id) {
        f_scr[i].title = films[a].title;
        f_scr[i].film_id = films[a]._id;
        f_scr[i].film_press_kit = films[a].press_kit_path;
        user_screenings.push(f_scr[i]);
      }
    }
  }
  return user_screenings;
}
Films.by_screening_id = function(screening_id) {
  return Films.findOne({ "screening._id": screening_id });
}
Films.return_film_and_screening = function(screening_id) {
  var film = Films.by_screening_id(screening_id);
  var screening = Films.return_screening(screening_id);
  return {film, screening};
}
Films.return_screening = function(screening_id){
  var film = Films.by_screening_id(screening_id);
  for (i = 0; i < film["screening"].length; i++) {
    if (film["screening"][i]._id == screening_id) {
      var screening = film["screening"][i]
    }
  }
  return screening;
}
Films.return_inventory = function(film){
  var screenings = film["screening"]
  var today = new Date();  
  
  if (screenings !== undefined){
    var scr_past = 0;
    var people = 0;
    var scr_scheduled = 0;
    var scr_zones = [];
    for (i = 0; i < screenings.length; i++) {
      var res = screenings[i]["date"].split("/");
      var screen_date = new Date(res[2]+'-'+res[1]+'-'+res[0]);

      if (today > screen_date) {
        scr_past++
        people = people + parseInt(screenings[i]["real_quorum"]);
        scr_zones.push({estado: screenings[i]["zone"]})
      } else {
        scr_scheduled++
      }
    }
  }
  
  if (scr_past !== undefined){
    if(FilmScreeningInventory[film.title] !== undefined){
      var inventory = FilmScreeningInventory[film.title]
    } else {
      var inventory = {}
    }

    inventory.sessoes = inventory.sessoes == undefined ? scr_past : inventory.sessoes + scr_past
    inventory.espectadores = inventory.espectadores == undefined ? people : inventory.espectadores + people
    inventory.sessoes_agendadas = scr_scheduled
    inventory.estados = _.uniq(scr_zones);
  }
  
  film["inventory"] = inventory;
  
  if (inventory !== undefined){
    return film;   
  }

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
