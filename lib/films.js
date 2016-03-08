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
  var films = Films.find({"screening.user_id":Meteor.userId()}).fetch();
  return films;
}

Films.screenings_by_user_id = function(){
  var user_id = Meteor.userId();
  var films = Films.by_user_id(user_id);
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
  console.log(screening);
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
Films.get_image_by_src = function(id, src){
  var film = Films.findOne(id),
      image;

  _.each(film.slideshow, function(img) {
    if (img.src == src) {
      image = img;
    }
  })

  return image;
}
Films.inventory = function(film){
  var screenings = film["screening"] || [],
      inventory = {
        viewers: 0,
        viewers_per_month: {},
        sessions: 0,
        scheduled_sessions: screenings.length,
        states: [],
        cities: [],
        categories: {},
        subcategories: {},
        viewers_zones: {}
      };

  var today = new Date(),
      states = [],
      cities = [],
      users = [],
      categories = [],
      subcategories = [],
      month,
      monthName;

  var monthNames = ["janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];


  _.each(screenings, function(screening) {
    //sessões - Sessões com data maior que hoje
    var d = screening['date'].split('/');
    var scheduledDate = new Date(d[1] + '/' + d[0] + '/' + d[2] + ' ' + screening['time']);
    inventory.sessions += (scheduledDate.getTime() > today.getTime()) ? 1 : 0;

    if ('real_quorum' in screening) {
      //espectadores - espectadores reais, não previsão
      inventory.viewers += parseInt(screening['real_quorum']);

      //espectadores por mês {[mes: quantidade]}
      monthName = monthNames[scheduledDate.getMonth()];

      if (monthName in inventory.viewers_per_month) {
        inventory.viewers_per_month[monthName] += parseInt(screening['real_quorum']);
      } else {
        inventory.viewers_per_month[monthName] = parseInt(screening['real_quorum']);
      }
    }

    //quais estados
    if ('uf' in screening) {
      states.push(screening['uf']);

      //espectadores por regiões:
      // FIXME Refatorar isso
      var zones = {
        'Sudeste': ['SP', 'ES', 'MG', 'RG'],
        'Sul': ['PR', 'SC', 'RS'],
        'Centro-Oeste': ['DF', 'GO', 'MS', 'MT'],
        'Nordeste': ['BA', 'AL', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
        'Norte': ['AM', 'PA', 'RO', 'RR', 'AC', 'AP', 'TO']
      };

      _.each(zones, function(states, zone) {
        if (states.indexOf(screening.uf) > 0) {
          incrementOrCreate(inventory.viewers_zones, zone);
        }
      })
    }

    //quais cidades
    cities.push(screening['city']);

    //TODO better way?
    users.push(Meteor.users.findOne(screening.user_id));
  })

  _.each(users, function(user) {
    if (user.profile && user.profile.name != 'admin') {
      //perfil dos embaixadores - Categories
      incrementOrCreate(inventory.categories, user.profile.category);

      //Area de atividade dos embaixadores - Subcategories
      incrementOrCreate(inventory.subcategories, user.profile.subcategory);
    }
  })

  inventory.cities = _.uniq(cities).length;
  inventory.states = _.uniq(states);

  return inventory;
}

function incrementOrCreate(obj, key) {
  obj[key] = (key in obj) ? (obj[key] + 1) : 1;
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
