if (Meteor.isClient) {
  Template.register.rendered = function() {
    $('.new-ambassador').validator()
  }
  
  Template.register.events({
    "submit .new-ambassador": function (event) {
      console.log("Pã!");
      
      event.preventDefault();

      var name = event.target.name.value;
      var email = event.target.email.value;
      var password = event.target.password.value;
      var phone = event.target.phone.value;
      var cpf = event.target.cpf.value;
      var institution = event.target.institution.value;
      var category = event.target.category.value;
      var subcategory = event.target.subcategory.value;
      
      Accounts.createUser({
        email: email,
        password: password,
        name: name,
        phone: phone,
        cpf: cpf,
        institution: institution,
        category: category,
        subcategory: subcategory,
        createdAt: new Date()
      }, function(err) {
        if (err)
          console.log(err);
        else
          console.log('success!');
      });
      event.target.reset();
      Router.go('/');  
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Router.route('/', function () {
  this.render('home');
});
Router.route('/register');
