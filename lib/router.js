Router.map(function(){
  this.route('home', {path:"/"});
  this.route('register');
  this.route('films');
  this.route('adm');
  this.route('adm/films');
  this.route('screenings');
  this.route('new-screening');
  this.route('about');
  this.route('login');
  this.route('denied');
  this.route('forget');
  this.route('ambassador');
  this.route('contact');

  this.route('new-screening/:_id', {
    template: 'newScreening',
    data: function(){
      var filmId = this.params._id;
      return Films.findOne({ _id: filmId });
    }
  });
  this.route('edit-screening/:_id', {
    template: 'admScreening',
    data: function(){
      return Films.return_film_and_screening(this.params._id);
      // var screeningId = this.params._id;
      // var film = Films.by_screening_id(screeningId);
      // for (i = 0; i < film["screening"].length; i++) {
      //   if (film["screening"][i]._id == screeningId) {
      //     var screening = film["screening"][i]
      //   }
      // }
      // return {film, screening};
    }
  });

  this.route('film/:_id', {
    template: 'showFilm',
    data: function(){
      var filmId = this.params._id;
      return Films.findOne({ _id: filmId });
    }
  });

  this.route('adm-films/:_id/edit', {
    template: 'admFilms',
    data: function(){
      var filmId = this.params._id;
      return Films.findOne({ _id: filmId });
    }
  });
});

var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('login');
  } else {
    this.next();
  }
};

var isAdmin = function(going) {
  var self = this;
  Meteor.users.find({_id: Meteor.userId()}).map(function(user){
    if (user.profile.roles[0]==='admin') {
      self.next();
    } else {
      Router.go('denied');
    }
  });
};

Router.onBeforeAction(mustBeSignedIn, {only: ['ambassador', 'adm', 'adm/films']});
Router.onBeforeAction(isAdmin, {only: ['adm', 'adm/films']});
//Router.onBeforeAction(fn, {only: ['index']});
