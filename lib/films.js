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
  var data = FilmScreeningInventory[film.title]

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

  var monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  _.each(screenings, function(screening) {
    //sessões - Sessões com data maior que hoje
    inventory.sessions += (screening.date > today.getTime()) ? 1 : 0;

    if ('real_quorum' in screening) {
      //espectadores - espectadores reais, não previsão
      inventory.viewers += parseInt(screening['real_quorum']);

      //espectadores por mês {[mes: quantidade]}
      monthName = monthNames[screening.date.getMonth()];

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

  if (data) {
    inventory.sessions += data.sessoes;
    inventory.scheduled_sessions += data.sessoes;
    inventory.viewers += data.espectadores;
    inventory.cities += data.municipios;
    inventory.states = _.uniq(inventory.states.concat(data.states));

    incrementOrCreate(inventory.viewers_zones, 'Sudeste', data.sessoes_se);
    incrementOrCreate(inventory.viewers_zones, 'Nordeste', data.sessoes_ne);
    incrementOrCreate(inventory.viewers_zones, 'Sul', data.sessoes_s);
    incrementOrCreate(inventory.viewers_zones, 'Norte', data.sessoes_n);
    incrementOrCreate(inventory.viewers_zones, 'Centro-Oeste', data.sessoes_co);

    inventory.viewers_per_month['Primeiro Mês'] = data.mes_1;
    inventory.viewers_per_month['Segundo Mês'] = data.mes_2;
    inventory.viewers_per_month['Terceiro Mês'] = data.mes_3;
    inventory.viewers_per_month['Quarto Mês'] = data.mes_4;

    // ambassadors categories
    incrementOrCreate(inventory.categories, 'Cineclube', data.categories.cineclube);
    incrementOrCreate(inventory.categories, 'Coletivo', data.categories.coletivo);
    incrementOrCreate(inventory.categories, 'Equipamento Público', data.categories.equipamento);
    incrementOrCreate(inventory.categories, 'Escola Pública', data.categories.escola_publica);
    incrementOrCreate(inventory.categories, 'Escola Privada', data.categories.escola_privada);
    incrementOrCreate(inventory.categories, 'Empresa', data.categories.empresa);
    incrementOrCreate(inventory.categories, 'Outros', data.categories.outros);
    incrementOrCreate(inventory.categories, 'Especialista', data.categories.especialista);
    incrementOrCreate(inventory.categories, 'Parque', data.categories.parque);
    incrementOrCreate(inventory.categories, 'Espaços e Centros Culturais', data.categories.centros);
    incrementOrCreate(inventory.categories, 'Instituição Governamental', data.categories.instituicao);
    incrementOrCreate(inventory.categories, 'Organização Social', data.categories.organizacao);
    incrementOrCreate(inventory.categories, 'Universidade', data.categories.universidade);
    incrementOrCreate(inventory.categories, 'Grupo Religioso', data.categories.grupo_religioso);
    incrementOrCreate(inventory.categories, 'Midia/Blog/Site', data.categories.midia);

    // ambassadors subcatgeories
    incrementOrCreate(inventory.subcategories, 'Audiovisual', data.subcategories.audiovisual);
    incrementOrCreate(inventory.subcategories, 'Artes Plásticas', data.subcategories.artes);
    incrementOrCreate(inventory.subcategories, 'Cidadania', data.subcategories.cidadania);
    incrementOrCreate(inventory.subcategories, 'Cultura', data.subcategories.cultura);
    incrementOrCreate(inventory.subcategories, 'Direito', data.subcategories.direito);
    incrementOrCreate(inventory.subcategories, 'Educaçao/Ensino/Pedagogia', data.subcategories.educacao);
    incrementOrCreate(inventory.subcategories, 'Gênero', data.subcategories.genero);
    incrementOrCreate(inventory.subcategories, 'Infância', data.subcategories.infancia);
    incrementOrCreate(inventory.subcategories, 'Juventude', data.subcategories.juventude);
    incrementOrCreate(inventory.subcategories, 'Política', data.subcategories.politica);
    incrementOrCreate(inventory.subcategories, 'Ponto de Cultura', data.subcategories.ponto);
    incrementOrCreate(inventory.subcategories, 'Saúde', data.subcategories.saude);
    incrementOrCreate(inventory.subcategories, 'SESC', data.subcategories.sesc);
    incrementOrCreate(inventory.subcategories, 'Meio Ambiente', data.subcategories.meio_ambiente);
    incrementOrCreate(inventory.subcategories, 'Outros', data.subcategories.outros);
    incrementOrCreate(inventory.subcategories, 'Cidade', data.subcategories.cidade);
    incrementOrCreate(inventory.subcategories, 'Comunicação', data.subcategories.comunicação);
    incrementOrCreate(inventory.subcategories, 'Psicologia/Psicanálise', data.subcategories.psicologia);
  }

  console.log(inventory);

  if (inventory.sessions > 0){
    return inventory;
  }
}

function incrementOrCreate(obj, key, increment) {
  increment = increment || 1;

  obj[key] = (key in obj) ? (obj[key] + increment) : increment;
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
