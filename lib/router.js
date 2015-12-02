Router.route('/', function () {
  this.render('home');
});
Router.route('/register');
Router.route('/films');
Router.route('/adm-films');
Router.route('/screenings');
Router.route('/about');
Router.route('/contact');

Router.route('/film/:_id', {
  template: 'showFilm',
  data: function(){
      var filmId = this.params._id;
      return Films.findOne({ _id: filmId });
  }
});