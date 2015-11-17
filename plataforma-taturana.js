// Users = new Meteor.users;

if (Meteor.isClient) {
  Template.register.rendered = function() {
    $('.new-ambassador').validator()
  }
  
  Template.register.events({
    "submit .new-ambassador": function (event) {
      console.log("Pã!");
      
      event.preventDefault();

      // var name = event.target.name.value;
      var email = event.target.email.value;
      var password = event.target.password.value;
      console.log(email);
      // var phone = event.target.phone.value;
      // var cpf = event.target.cpf.value;
      // var institution = event.target.institution.value;
      // var category = event.target.category.value;
      // var subcategory = event.target.subcategory.value;
      // Accounts.createUser({
      //   // name: name,
      //   email: email,
      //   password: password,
      //   // phone: phone,
      //   // cpf: cpf,
      //   // institution: institution,
      //   // category: category,
      //   // subcategory: subcategory,
      //   createdAt: new Date()
      // });
      Accounts.createUser({email: email, password: password}, function(err) {
        if (err)
          console.log(err);
        else
          console.log('success!');
      });
 
      event.target.reset();
      var userscadastrados = Meteor.users.find().fetch();
      console.log(userscadastrados)
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
