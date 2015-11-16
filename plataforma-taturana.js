Ambassadors = new Mongo.Collection("ambassadors");

if (Meteor.isClient) {
  Template.ambassadorRegistration.rendered = function() {
    $('.new-ambassador').validator()
  }
  
  Template.ambassadorRegistration.events({
    "submit .new-ambassador": function (event) {
      console.log("Pã!");
      
      event.preventDefault();

      var name = event.target.name.value;
      var email = event.target.email.value;
      var email = event.target.email.value;
      var password = event.target.password.value;
      var password = event.target.password.value;
      var phone = event.target.phone.value;
      var cpf = event.target.cpf.value;
      var institution = event.target.institution.value;
      var category = event.target.category.value;
      var subcategory = event.target.subcategory.value;

      Ambassadors.insert({
        name: name,
        email: email,
        //password: password,
        phone: phone,
        cpf: cpf,
        institution: institution,
        category: category,
        subcategory: subcategory,
        createdAt: new Date()
      });
 
      event.target.reset();
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
Router.route('/ambassador-registration');
