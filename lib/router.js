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

  this.route('adm/films/:slug/edit', {
    template: 'admFilms',

    waitOn: function() {
      return this.subscribe('films', this.params.slug);
    },

    data: function(){
      Session.set('poster_path', null);
      return Films.findOne({ slug: this.params.slug });
    }
  });

  this.route('adm/ambassador/:_id', {
    template: 'admAmbassador',
    data: function(){
      return Meteor.users.findOne({_id: this.params._id});
    }
  });

  this.route('new-screening/:slug', {
    template: 'newScreening',

    waitOn: function() {
      return this.subscribe('films', this.params.slug);
    },

    data: function() {
      Session.set('address', null);
      var filmId = this.params._id;
      return Films.findOne({ slug: this.params.slug });
    }
  });

  this.route('edit-screening/:_id', {
    name: 'edit-screening',
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

  this.route('film/:slug', {
    template: 'showFilm',

    waitOn: function() {
      return this.subscribe('films', this.params.slug);
    },

    data: function(){
      var filmId = this.params._id;
      return Films.findOne({ slug: this.params.slug });
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

Router.onBeforeAction(mustBeSignedIn, {only: ['ambassador', 'ambassador-edit', 'new-screening/:slug', 'edit-screening/:_id', 'report/:_id']});
Router.onBeforeAction(isAdmin, {only: ['adm', 'adm/films', 'adm/report/:_id', 'adm/film/:_id/reports', 'adm/session/:_id', 'adm/ambassador/:_id', 'adm/films/:slug/edit', 'adm/films' ]});
//Router.onBeforeAction(fn, {only: ['index']});
