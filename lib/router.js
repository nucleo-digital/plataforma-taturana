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
  console.log(Meteor.user(), Meteor.loggingIn(), this, pause);
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('login');
  } else {
    this.next();
  }
};

var isAdmin = function(going) {
  var self = this;
  var userId = Meteor.userId();
  if (userId == null) {
    Router.go('login');
  }
  Meteor.users.find({_id: Meteor.userId()}).map(function(user){
    if (user.profile.roles[0]==='admin') {
      self.next();
    } else {
      Router.go('denied');
    }
  });
};


var admin_uris = [
  'adm',
  'adm/ambassador/:_id',
  'adm/film/:_id/reports',
  'adm/films',
  'adm/films',
  'adm/films/:slug/edit',
  'adm/report/:_id',
  'adm/session/:_id',
  'adm/sessions'
];
var signed_in_uris = [
  'ambassador',
  'ambassador-edit',
  'edit-screening/:_id',
  'new-screening/:slug',
  'report/:_id'
].concat(admin_uris);

Router.onBeforeAction(mustBeSignedIn, {only: signed_in_uris});
Router.onBeforeAction(isAdmin, {only: admin_uris});

//Router.onBeforeAction(fn, {only: ['index']});
