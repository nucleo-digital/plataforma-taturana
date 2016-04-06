_ = lodash;

Router.map(function(){
  this.route('home', {path:"/"});
  this.route('register');
  this.route('ambassador-edit');
  this.route('films');
  this.route('adm');
  this.route('adm/sessions');
  this.route('adm/ambassadors');
  this.route('screenings');
  this.route('about');
  this.route('login');
  this.route('denied');
  this.route('forget');
  this.route('ambassador');
  this.route('contact');

  this.route('adm/films', {
    data: function() {
      Session.set('poster_path', null);

      return;
    }
  });

  this.route('reset-password/:token', {
    template: 'resetPassword'
  });

  this.route('adm/films/:_id/edit', {
    template: 'admFilms',
    data: function(){
      Session.set('poster_path', null);
      return Films.findOne({ _id: this.params._id });
    }
  });

  this.route('adm/ambassador/:_id', {
    template: 'admAmbassador',
    data: function(){
      return Meteor.users.findOne({_id: this.params._id});
    }
  });

  this.route('new-screening/:_id', {
    template: 'newScreening',
    data: function() {
      Session.set('address', null);
      var filmId = this.params._id;
      return Films.findOne({ _id: filmId });
    }
  });
  this.route('edit-screening/:_id', {
    template: 'admScreening',
    data: function(){
      return Films.return_film_and_screening(this.params._id);
    }
  });
  this.route('report/:_id', {
    template: 'report',
    data: function(){
      return Films.return_film_and_screening(this.params._id);
    }
  });
  this.route('adm/session/:_id', {
    template: 'admSession',
    data: function(){
      var sessionId = this.params._id;
      return Films.return_screening(sessionId);
    }
  });

  this.route('adm/film/:_id/reports', {
    template: 'admReports',
    data: function(){
      var filmId = this.params._id;
      return Films.findOne({ _id: filmId });
    }
  });

  this.route('adm/report/:_id', {
    template: 'admReport',
    data: function(){
      return Films.return_film_and_screening(this.params._id);
    }
  });

  this.route('film/:_id', {
    template: 'showFilm',
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
